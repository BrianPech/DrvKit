import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Wifi, EthernetPort, Loader2, ArrowDown, ArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NetworkInfo {
  name: string;
  received: number; // Bytes
  transmitted: number; // Bytes
  total_received: number;
  total_transmitted: number;
  mac_address: string;
  ip_addresses: string[];
}

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
  networks: NetworkInfo[];
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatSpeed(bytes: number) {
  return `${formatBytes(bytes)}/s`;
}

export function NetworkView() {
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
    // Poll every 1 second for smoother speed updates
    const interval = setInterval(fetchStats, 1000);
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
        No se pudo cargar la información de red.
      </div>
    );
  }

  // Filter out loopback or empty interfaces if desired, but user might want to see everything
  // For better UX, let's sort by activity (total received desc)
  const sortedNetworks = [...stats.networks].sort(
    (a, b) => b.total_received - a.total_received,
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Red y Conectividad
        </h2>
        <p className="text-muted-foreground">
          Monitor de tráfico e interfaces en tiempo real.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedNetworks.map((net, i) => {
          // Identify type roughly by name (not perfect but helpful)
          const isWifi = net.name.startsWith("w") || net.name.includes("wifi");

          return (
            <Card
              key={i}
              className="dark:bg-card/50 dark:backdrop-blur-sm border-muted"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                      {isWifi ? (
                        <Wifi className="h-5 w-5" />
                      ) : (
                        <EthernetPort className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{net.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {net.mac_address === "00:00:00:00:00:00"
                          ? "Virtual / N/A"
                          : net.mac_address}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Real-time Speed */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 rounded-lg border bg-background/50 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ArrowDown className="h-3 w-3" />
                      <span className="text-xs uppercase font-semibold">
                        Bajada
                      </span>
                    </div>
                    <span className="text-lg font-bold font-mono text-primary">
                      {formatSpeed(net.received)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border bg-background/50 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-xs uppercase font-semibold">
                        Subida
                      </span>
                    </div>
                    <span className="text-lg font-bold font-mono text-primary/80">
                      {formatSpeed(net.transmitted)}
                    </span>
                  </div>
                </div>

                {/* Total Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="block mb-0.5">Total Recibido</span>
                    <span className="font-medium text-foreground">
                      {formatBytes(net.total_received)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block mb-0.5">Total Enviado</span>
                    <span className="font-medium text-foreground">
                      {formatBytes(net.total_transmitted)}
                    </span>
                  </div>
                </div>

                {/* IP Addresses */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Direcciones IP
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {net.ip_addresses.length > 0 ? (
                      net.ip_addresses.map((ip, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="font-mono text-[10px] font-normal"
                        >
                          {ip}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Sin asignar
                      </span>
                    )}
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
