import {
  Cpu,
  HardDrive,
  LaptopMinimal,
  MemoryStick,
  Microchip,
  CircuitBoard,
  Server,
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
import { Badge } from "@/components/ui/badge";

export function DeviceView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Información del dispositivo
        </h2>
        <p className="text-muted-foreground">
          Especificaciones técnicas y estado del hardware.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sistema Operativo
            </CardTitle>
            <LaptopMinimal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Linux</div>
            <p className="text-xs text-muted-foreground">
              Kernel 6.9.1-arch1-1
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procesador</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AMD Ryzen 7</div>
            <p className="text-xs text-muted-foreground">5800X3D · 8 Cores</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memoria RAM</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 GB</div>
            <p className="text-xs text-muted-foreground">DDR4 · 3200 MHz</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tarjeta Gráfica
            </CardTitle>
            <Microchip className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RTX 4070</div>
            <p className="text-xs text-muted-foreground">NVIDIA · 12 GB VRAM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recursos del sistema</CardTitle>
            <CardDescription>
              Uso actual de CPU y Memoria (Simulado).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span className="font-medium">Uso de CPU</span>
                </div>
                <span className="text-muted-foreground">12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-primary" />
                  <span className="font-medium">Uso de RAM</span>
                </div>
                <span className="text-muted-foreground">45% (14.4 GB)</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  <span className="font-medium">SWAP</span>
                </div>
                <span className="text-muted-foreground">2%</span>
              </div>
              <Progress value={2} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Almacenamiento</CardTitle>
            <CardDescription>
              Unidades conectadas y espacio disponible.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <HardDrive className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    NVMe System
                  </p>
                  <p className="text-xs text-muted-foreground">/dev/nvme0n1</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">1 TB</p>
                <p className="text-xs text-muted-foreground">60% Usado</p>
              </div>
            </div>
            <Progress value={60} className="h-1.5" />

            <Separator />

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-muted p-2 text-muted-foreground">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Data HDD</p>
                  <p className="text-xs text-muted-foreground">/dev/sda1</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">4 TB</p>
                <p className="text-xs text-muted-foreground">25% Usado</p>
              </div>
            </div>
            <Progress value={25} className="h-1.5" />
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Hardware Detallado</CardTitle>
          <CardDescription>Información de componentes base.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Placa Base
                </label>
                <p className="text-xs text-muted-foreground">
                  ASUS ROG STRIX B550-F GAMING
                </p>
              </div>
              <CircuitBoard className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  BIOS Version
                </label>
                <p className="text-xs text-muted-foreground">
                  v2803 (Release: 2023-10-12)
                </p>
              </div>
              <Badge variant="outline">UEFI</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
