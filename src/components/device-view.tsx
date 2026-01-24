import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Cpu,
  HardDrive,
  LaptopMinimal,
  MemoryStick,
  Microchip,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DeviceDetailDialog } from "@/components/device-detail-dialog";

interface DiskInfo {
  name: String;
  mount_point: String;
  total_space: number;
  available_space: number;
}

interface SystemStats {
  os_name: String;
  kernel_version: String;
  cpu_brand: String;
  core_count: number;
  cpu_frequency: number;
  architecture: string;
  host_name: string;
  uptime: number;
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

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (parts.length === 0) return `${seconds}s`;

  return parts.join(" ");
}

function getGpuType(name: string) {
  const lower = name.toLowerCase();
  // Common integrated GPU keywords
  if (
    lower.includes("integrated") ||
    lower.includes("intel") || // Intel HD/UHD/Iris (Usually integrated, Arc is rare/distinct)
    lower.includes("uhd") ||
    lower.includes("iris") ||
    lower.includes("vega") || // AMD APUs
    lower.includes("picasso") ||
    lower.includes("renoir") ||
    lower.includes("cezanne") ||
    lower.includes("raven") ||
    (lower.includes("amd") &&
      !lower.includes("rx") &&
      !lower.includes("pro") &&
      !lower.includes("firepro"))
  ) {
    if (
      lower.includes("arc") ||
      lower.includes("sparkle") ||
      lower.includes("gunnir")
    )
      return "Dedicada"; // Intel Arc exceptions
    return "Integrada";
  }
  return "Dedicada";
}

export function DeviceView() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

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

    // Initial fetch
    fetchStats();

    // Poll every 2 seconds
    const interval = setInterval(fetchStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenDetail = (type: string) => {
    setSelectedType(type);
    setDialogOpen(true);
  };

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
        No se pudo cargar la información del sistema.
      </div>
    );
  }

  const memUsagePercent = (stats.memory_used / stats.memory_total) * 100;

  let dialogContent = {
    title: "",
    description: "",
    icon: LaptopMinimal,
    details: [] as {
      label: string;
      value: string | number;
      highlight?: boolean;
    }[],
  };

  if (selectedType === "os") {
    dialogContent = {
      title: "Sistema Operativo",
      description: "Detalles del entorno de software",
      icon: LaptopMinimal,
      details: [
        { label: "Nombre", value: stats.os_name as string, highlight: true },
        { label: "Kernel", value: stats.kernel_version as string },
        { label: "Arquitectura", value: stats.architecture },
        { label: "Host Name", value: stats.host_name },
        { label: "Tiempo de actividad", value: formatUptime(stats.uptime) },
      ],
    };
  } else if (selectedType === "cpu") {
    dialogContent = {
      title: "Procesador (CPU)",
      description: "Unidad Central de Procesamiento",
      icon: Cpu,
      details: [
        {
          label: "Marca/Modelo",
          value: stats.cpu_brand as string,
          highlight: true,
        },
        { label: "Núcleos Físicos", value: stats.core_count },
        { label: "Hilos (Threads)", value: stats.core_count * 2 }, // Estimate from physical, logical is better if available but this is decent
        { label: "Frecuencia Base", value: `${stats.cpu_frequency} MHz` },
        { label: "Arquitectura", value: stats.architecture },
      ],
    };
  } else if (selectedType === "ram") {
    dialogContent = {
      title: "Memoria RAM",
      description: "Memoria de Acceso Aleatorio",
      icon: MemoryStick,
      details: [
        {
          label: "Total Instalado",
          value: formatBytes(stats.memory_total),
          highlight: true,
        },
        { label: "En Uso", value: formatBytes(stats.memory_used) },
        {
          label: "Disponible",
          value: formatBytes(stats.memory_total - stats.memory_used),
        },
        {
          label: "Porcentaje Uso",
          value: `${((stats.memory_used / stats.memory_total) * 100).toFixed(1)}%`,
        },
      ],
    };
  } else if (selectedType === "gpu") {
    dialogContent = {
      title: "Tarjeta Gráfica (GPU)",
      description: "Unidad de Procesamiento Gráfico",
      icon: Microchip,
      details: [
        {
          label: "Modelo Detectado",
          value: stats.gpu_name as string,
          highlight: true,
        },
        {
          label: "Tipo",
          value: getGpuType(stats.gpu_name as string),
        },
        { label: "Estado", value: "Activo" },
      ],
    };
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Información del sistema
        </h2>
        <p className="text-muted-foreground">
          Especificaciones técnicas y estado del hardware (Tiempo real).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="dark:bg-card/50 dark:backdrop-blur-sm cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleOpenDetail("os")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sistema Operativo
            </CardTitle>
            <LaptopMinimal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold truncate"
              title={stats.os_name as string}
            >
              {stats.os_name}
            </div>
            <p
              className="text-xs text-muted-foreground truncate"
              title={stats.kernel_version as string}
            >
              Kernel {stats.kernel_version}
            </p>
          </CardContent>
        </Card>
        <Card
          className="dark:bg-card/50 dark:backdrop-blur-sm cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleOpenDetail("cpu")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procesador</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-lg font-bold truncate"
              title={stats.cpu_brand as string}
            >
              {stats.cpu_brand}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.core_count} Cores Físicos
            </p>
          </CardContent>
        </Card>
        <Card
          className="dark:bg-card/50 dark:backdrop-blur-sm cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleOpenDetail("ram")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memoria RAM</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(stats.memory_total)}
            </div>
            <p className="text-xs text-muted-foreground">Total Instalado</p>
          </CardContent>
        </Card>
        <Card
          className="dark:bg-card/50 dark:backdrop-blur-sm cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleOpenDetail("gpu")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              GPU (Detectada)
            </CardTitle>
            <Microchip className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{stats.gpu_name}</div>
            <p className="text-xs text-muted-foreground">Principal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recursos del sistema</CardTitle>
            <CardDescription>
              Estado en tiempo real (Actualizado cada 2s).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-primary" />
                  <span className="font-medium">Uso de RAM</span>
                </div>
                <span className="text-muted-foreground">
                  {memUsagePercent.toFixed(1)}% (
                  {formatBytes(stats.memory_used)})
                </span>
              </div>
              <Progress value={memUsagePercent} className="h-2" />
            </div>

            <div className="rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Nota: El uso de CPU en tiempo real requiere sondeo constante
                (polling), lo cual no está activo en esta vista estática para
                ahorrar recursos.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Almacenamiento</CardTitle>
            <CardDescription>
              Unidades detectadas ({stats.disks.length}).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 max-h-[300px] overflow-y-auto pr-2">
            {stats.disks.map((disk, i) => {
              const used = disk.total_space - disk.available_space;
              const usedPercent = (used / disk.total_space) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between space-x-4 mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <HardDrive className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium leading-none truncate max-w-[120px]"
                          title={disk.name as string}
                        >
                          {disk.name || "Disco Local"}
                        </p>
                        <p
                          className="text-xs text-muted-foreground truncate max-w-[120px]"
                          title={disk.mount_point as string}
                        >
                          {disk.mount_point}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium">
                        {formatBytes(disk.total_space)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {usedPercent.toFixed(0)}% Usado
                      </p>
                    </div>
                  </div>
                  <Progress value={usedPercent} className="h-1.5" />
                  {i < stats.disks.length - 1 && <Separator className="my-4" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <DeviceDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogContent.title}
        description={dialogContent.description}
        icon={dialogContent.icon}
        details={dialogContent.details}
      />
    </div>
  );
}
