import {
  Cog,
  Cpu,
  Download,
  HardDrive,
  MonitorSmartphone,
  Network,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const deviceStatus = [
  {
    name: "Tarjeta de red",
    status: "Conectado",
    icon: Wifi,
    tone: "success" as const,
  },
  {
    name: "GPU dedicada",
    status: "Controlador optimizado",
    icon: MonitorSmartphone,
    tone: "success" as const,
  },
  {
    name: "Chipset",
    status: "Actualización sugerida",
    icon: Cpu,
    tone: "warning" as const,
  },
  {
    name: "Almacenamiento",
    status: "Revisión",
    icon: HardDrive,
    tone: "warning" as const,
  },
  {
    name: "Bluetooth",
    status: "Sin controlador",
    icon: Network,
    tone: "danger" as const,
  },
];

const downloads = [
  { name: "Driver GPU NVIDIA", version: "v556.12", size: "642 MB" },
  { name: "Intel Chipset", version: "v12.3", size: "154 MB" },
  { name: "Realtek WiFi", version: "v2024.4", size: "98 MB" },
];

function StatusPill({
  tone,
  children,
}: {
  tone: "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const styles = {
    success:
      "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-900/50",
    warning:
      "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-900/50",
    danger:
      "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-900/50",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        styles,
      )}
    >
      {children}
    </span>
  );
}

export function DashboardView() {
  return (
    <div className="grid gap-4 lg:grid-cols-12 max-w-7xl mx-auto">
      <section className="space-y-4 lg:col-span-8">
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl">Visión general</CardTitle>
              <CardDescription>
                Monitorea el estado de tus controladores.
              </CardDescription>
            </div>
            <Badge className="flex items-center gap-1 bg-emerald-600 text-emerald-50 dark:bg-emerald-600/20 dark:text-emerald-400 dark:border-emerald-600/20 shadow-none">
              <ShieldCheck className="size-3" />
              Seguro
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {deviceStatus.map((device) => (
              <div
                key={device.name}
                className="flex items-start justify-between rounded-lg border bg-muted/50 p-4 transition-colors hover:bg-muted/80 dark:bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <device.icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{device.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {device.status}
                    </p>
                  </div>
                </div>
                <StatusPill tone={device.tone}>
                  {device.tone === "success"
                    ? "Ok"
                    : device.tone === "warning"
                      ? "Atención"
                      : "Acción"}
                </StatusPill>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-4 lg:col-span-4">
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Descargas pendientes</CardTitle>
            <CardDescription>3 actualizaciones disponibles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {downloads.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border bg-background p-3 dark:bg-background/40"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <p className="truncate font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.version} · {item.size}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-2 px-2">
                  <Download className="size-3.5" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    Instalar
                  </span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Seguridad</CardTitle>
              <CardDescription>Integridad del sistema.</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Cog className="size-4" />
              <span className="sr-only">Configurar</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Descargas verificadas", value: "128" },
              { label: "Bloqueos preventivos", value: "6" },
              { label: "Reportes generados", value: "12" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border bg-muted/50 p-3 dark:bg-muted/20"
              >
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
                <div className="text-muted-foreground/40">
                  <ShieldCheck className="size-4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
