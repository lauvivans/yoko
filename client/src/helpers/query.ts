class QueryManager {
  params = new URLSearchParams();

  public query(queries: Record<string, string>) {
    Object.entries(queries).forEach((q) => this.params.set(q[0], q[1]));
    this.buildUrl(this.params);
  }

  public cleanQuery() {
    this.buildUrl();
  }

  public getQuery(key: string): string {
    return this.params.get(key) ?? '';
  }

  private buildUrl(params?: URLSearchParams) {
    let newUrl = `${window.location.pathname}`;

    if (params) {
      newUrl += `?${params.toString()}`;
    }

    window.history.pushState({}, '', newUrl);
  }
}

export default QueryManager;
