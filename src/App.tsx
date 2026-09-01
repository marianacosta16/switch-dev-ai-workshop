import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HealthStatus {
  status: string;
  timestamp: string;
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setError(null);
      const response = await fetch("/api/health");
      const data = await response.json();
      setHealth(data);
    } catch {
      setError("Could not reach the backend. Is the server running?");
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-svh bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Switch Dev AI Workshop</CardTitle>
          <CardDescription>
            React + Tailwind CSS + shadcn/ui + Express
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Edit <code className="bg-muted px-1 rounded text-foreground">src/App.tsx</code> and
            save to test HMR.
          </p>

          <div className="rounded-md border p-4 space-y-2">
            <p className="text-sm font-medium">Backend health check</p>
            {health ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                Status: {health.status} &mdash;{" "}
                {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Checking...</p>
            )}
          </div>

          <Button onClick={checkHealth} className="w-full">
            Refresh health check
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
