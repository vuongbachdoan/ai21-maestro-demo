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

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    console.log('Making request to:', url);
    console.log('Request data:', JSON.stringify(data, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP POST failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
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
}

type Role = "user" | "assistant";
type RunStatus = "completed" | "failed" | "in_progress" | "requires_action";

interface MaestroMessage {
  role: Role;
  content: string;
}

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
  include?: string[];
}

const TERMINATED_RUN_STATUSES: RunStatus[] = ["completed", "failed", "requires_action"];

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

  async pollForStatus(runId: string, pollIntervalSec: number = 1, pollTimeoutSec: number = 60): Promise<RunResponse> {
    let currentRun = await this.retrieve(runId);
    const startTime = Date.now();
    const timeoutMs = pollTimeoutSec * 1000;
    const intervalMs = pollIntervalSec * 1000;

    while (TERMINATED_RUN_STATUSES.indexOf(currentRun.status) === -1) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Polling timeout after ${pollTimeoutSec} seconds`);
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      currentRun = await this.retrieve(runId);
    }

    return currentRun;
  }

  async createAndPoll(data: CreateRun, pollIntervalSec: number = 1, pollTimeoutSec: number = 60): Promise<RunResponse> {
    const run = await this.create(data);
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
    this.httpClient = new HttpClient(apiKey, 'https://api.ai21.com/studio/v1');
    this.maestro = new Maestro(this.httpClient);
  }
}

export type { MaestroMessage, Requirement, RunResponse };