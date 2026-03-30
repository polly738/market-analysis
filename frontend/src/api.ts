const BASE_URL = "http://localhost:8080";

interface AnalysisRequest {
    market: string;
    company: string;
}

interface AnalysisResponse {
    go: boolean;
    summary: string;
}

export async function fetchAnalysis(
    params: AnalysisRequest,
): Promise<AnalysisResponse> {
    const res = await fetch(`${BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        throw new Error(`Analysis failed: ${res.status}`);
    }

    return res.json();
}
