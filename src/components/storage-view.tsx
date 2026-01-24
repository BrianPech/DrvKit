import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { HardDrive, Loader2, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DiskInfo {
  name: String;
  mount_point: String;
  total_space: number;
  available_space: number;
  file_system: String;
}

interface SystemStats {
  os_name: String;
  kernel_version: String;
  cpu_brand: String;
  core_count: number;
  memory_total: number;
  memory_used: number;
  gpu_name: String;
  disks: DiskInfo[];
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function StorageView() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await invoke<SystemStats>("get_system_stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch system stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    // Poll every 5 seconds for storage (less critical than RAM)
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-muted-foreground">
        No se pudo cargar la información de almacenamiento.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Almacenamiento</h2>
        <p className="text-muted-foreground">
          Gestión y estado de las unidades conectadas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.disks.map((disk, i) => {
          const used = disk.total_space - disk.available_space;
          const usedPercent = (used / disk.total_space) * 100;
          const isHighUsage = usedPercent > 90;

          return (
            <Card
              key={i}
              className="dark:bg-card/50 dark:backdrop-blur-sm border-muted transition-all hover:border-primary/50"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                      {disk.name.includes("nvme") ? (
                        <Database className="h-5 w-5" />
                      ) : (
                        <HardDrive className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle
                        className="text-base truncate max-w-[150px]"
                        title={disk.name as string}
                      >
                        {disk.name || "Disco Local"}
                      </CardTitle>
                      <CardDescription
                        className="font-mono text-xs truncate max-w-[150px]"
                        title={disk.mount_point as string}
                      >
                        {disk.mount_point}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="font-normal font-mono text-xs"
                  >
                    {disk.file_system}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uso</span>
                    <span
                      className={
                        isHighUsage
                          ? "text-destructive font-medium"
                          : "font-medium"
                      }
                    >
                      {usedPercent.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={usedPercent}
                    className="h-2"
                    indicatorClassName={isHighUsage ? "bg-destructive" : ""}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Total</p>
                    <p className="font-medium">
                      {formatBytes(disk.total_space)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Disponible</p>
                    <p className="font-medium">
                      {formatBytes(disk.available_space)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
