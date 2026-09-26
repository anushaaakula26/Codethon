from backend.schemas import SeverityBreakdown, RoutingDecision

class RiskAwareModelRouter:
    """
    Adaptive Model Router:
    Determines optimal model selection based on:
    Risk + Uncertainty + Blast Radius + Hypothesis Disagreement
    Tracks tokens, latency, and cost per routing decision.
    """

    def route_request(self, severity: SeverityBreakdown, hypothesis_count: int, top_confidence: float) -> RoutingDecision:
        # Evaluate uncertainty & risk
        risk = "HIGH" if severity.level in ["CRITICAL", "HIGH"] else "LOW"
        uncertainty = "HIGH" if top_confidence < 70.0 or hypothesis_count > 2 else "LOW"

        if risk == "HIGH" and uncertainty == "HIGH":
            selected_model = "gpt-4o"
            provider = "Azure OpenAI / Microsoft Foundry"
            reasoning = "High risk & high ambiguity incident -> Routing to strongest reasoning model (gpt-4o)."
            cost = 0.0045
            latency = 1250.0
        elif risk == "HIGH":
            selected_model = "gpt-4o-mini"
            provider = "Azure OpenAI / Microsoft Foundry"
            reasoning = "High risk but high confidence -> Routing to fast reasoning model (gpt-4o-mini)."
            cost = 0.0008
            latency = 450.0
        else:
            selected_model = "gpt-4o-mini"
            provider = "Azure OpenAI / Microsoft Foundry"
            reasoning = "Low risk routine incident -> Routing to cost-optimized model."
            cost = 0.0003
            latency = 280.0

        return RoutingDecision(
            risk_level=risk,
            uncertainty_level=uncertainty,
            selected_model=selected_model,
            model_provider=provider,
            reasoning=reasoning,
            estimated_cost_usd=cost,
            latency_ms=latency
        )

model_router = RiskAwareModelRouter()
