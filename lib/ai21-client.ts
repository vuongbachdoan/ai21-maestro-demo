class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  async get<T = any>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`HTTP GET failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);

    const response = await fetch(url, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP POST failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Literal types
type Budget = "low" | "medium" | "high";
type Role = "user" | "assistant";
type RunStatus = "completed" | "failed" | "in_progress" | "requires_action";
type OutputOptions = "data_sources" | "requirements_result";

// constatns
const TERMINATED_RUN_STATUSES: RunStatus[] = ["completed", "failed", "requires_action"];

// Core message types
interface MaestroMessage {
    role: Role;
    content: string;
}

// Requirement types
interface Requirement {
    name: string;
    description: string;
    is_mandatory?: boolean;
}

interface RequirementResultItem extends Requirement {
    score: number;
    reason?: string;
}

interface RequirementsResult {
    score: number;
    finish_reason: string;
    requirements: RequirementResultItem[];
}

// Main response type
interface RunResponse {
    id: string;
    status: RunStatus;
    result: any;
    requirements_result?: RequirementsResult;
}

interface CreateRun {
    input: string | MaestroMessage[];
    models?: string[];
    requirements?: Requirement[];
    budget?: Budget;
    include?: OutputOptions[];
}

class MaestroRuns {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async create(data: CreateRun): Promise<RunResponse> {
    return this.httpClient.post<RunResponse>('maestro/runs', data);
  }

  async retrieve(runId: string): Promise<RunResponse> {
    return this.httpClient.get<RunResponse>(`maestro/runs/${runId}`);
  }

  async pollForStatus(runId: string, pollIntervalSec: number, pollTimeoutSec: number): Promise<RunResponse> {
    // Get the initial run to capture the starting status
    let currentRun = await this.retrieve(runId);

    const startTime = Date.now();
    const timeoutMs = pollTimeoutSec * 1000;
    const intervalMs = pollIntervalSec * 1000;

    // Poll until status changes to terminated
    while (TERMINATED_RUN_STATUSES.indexOf(currentRun.status) === -1) {
      // Check if we've exceeded the timeout
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Polling timeout after ${pollTimeoutSec} seconds. Run ${runId} still has status: ${currentRun.status}`);
      }

      // Wait for the poll interval
      await new Promise(resolve => setTimeout(resolve, intervalMs));

      // Retrieve the updated run
      currentRun = await this.retrieve(runId);
    }

    return currentRun;
  }

  async createAndPoll(data: CreateRun, pollIntervalSec: number = 1, pollTimeoutSec: number = 120): Promise<RunResponse> {
    // Create the run
    const run = await this.create(data);

    // Poll until status changes
    return this.pollForStatus(run.id, pollIntervalSec, pollTimeoutSec);
  }
}

class Maestro {
  public runs: MaestroRuns;

  constructor(httpClient: HttpClient) {
    this.runs = new MaestroRuns(httpClient);
  }
}

export default class AI21Client {
  private httpClient: HttpClient;
  public maestro: Maestro;

  constructor(apiKey: string) {
    this.httpClient = new HttpClient(apiKey, 'https://api.ai21.com/studio/v1/');
    this.maestro = new Maestro(this.httpClient);
  }
}

export type { MaestroMessage, Requirement, RunResponse };