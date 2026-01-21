import {
  ClipboardCopy,
  Cog,
  Cpu,
  Download,
  HardDrive,
  MonitorSmartphone,
  Network,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Wifi,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const quickActions = [
  { label: "Escanear drivers", icon: Search },
  { label: "Actualizar todo", icon: RefreshCw },
  { label: "Crear copia", icon: ClipboardCopy },
]

const deviceStatus = [
  { name: "Tarjeta de red", status: "Conectado", icon: Wifi, tone: "success" as const },
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
  { name: "Almacenamiento", status: "Revisión", icon: HardDrive, tone: "warning" as const },
  { name: "Bluetooth", status: "Sin controlador", icon: Network, tone: "danger" as const },
]

const downloads = [
  { name: "Driver GPU NVIDIA", version: "v556.12", size: "642 MB" },
  { name: "Intel Chipset", version: "v12.3", size: "154 MB" },
  { name: "Realtek WiFi", version: "v2024.4", size: "98 MB" },
]

function StatusPill({ tone, children }: { tone: "success" | "warning" | "danger"; children: React.ReactNode }) {
  const styles = {
    success: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-100 dark:bg-emerald-900/40 dark:border-emerald-800",
    warning: "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-100 dark:bg-amber-900/40 dark:border-amber-800",
    danger: "text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-100 dark:bg-rose-900/40 dark:border-rose-800",
  }[tone]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        styles
      )}
    >
      {children}
    </span>
  )
}

function AppShell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40 text-foreground">
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar className="border-r">
            <SidebarHeader>
              <div className="flex items-center justify-between rounded-lg bg-primary/5 p-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">DrvKit</p>
                    <p className="text-xs text-muted-foreground">Asistente de drivers</p>
                  </div>
                </div>
                <SidebarTrigger />
              </div>
              <Input placeholder="Buscar dispositivos..." className="h-9 bg-sidebar/60" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Panel</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { label: "Resumen", icon: ShieldCheck, active: true },
                      { label: "Dispositivos", icon: MonitorSmartphone },
                      { label: "Red y conectividad", icon: Wifi },
                      { label: "Almacenamiento", icon: HardDrive },
                      { label: "Configuración", icon: Settings2 },
                    ].map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel>Rápido</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="grid gap-2">
                    {quickActions.map((action) => (
                      <Button key={action.label} variant="outline" className="justify-start gap-2">
                        <action.icon className="size-4" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex items-center justify-between rounded-lg border bg-muted/60 p-3">
                <div>
                  <p className="text-sm font-semibold">Modo seguro</p>
                  <p className="text-xs text-muted-foreground">Descargas verificadas</p>
                </div>
                <Badge variant="secondary" className="text-[11px]">
                  Activo
                </Badge>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-background/80 backdrop-blur-sm">
            <header className="flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Estado</p>
                  <p className="text-lg font-semibold">Sistema protegido y optimizado</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-4" />
                  Exportar
                </Button>
                <Button size="sm" className="gap-2">
                  <RefreshCw className="size-4" />
                  Sincronizar
                </Button>
              </div>
            </header>

            <div className="grid flex-1 gap-4 overflow-y-auto p-6 lg:grid-cols-12">
              <Card className="lg:col-span-8">
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Visión general</CardTitle>
                    <CardDescription>Monitorea el estado de tus controladores.</CardDescription>
                  </div>
                  <Badge className="flex items-center gap-1 bg-emerald-600 text-emerald-50">
                    <ShieldCheck className="size-3" />
                    Seguro
                  </Badge>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {deviceStatus.map((device) => (
                    <div
                      key={device.name}
                      className="flex items-start justify-between rounded-lg border bg-muted/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-primary/10 p-2 text-primary">
                          <device.icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{device.name}</p>
                          <p className="text-sm text-muted-foreground">{device.status}</p>
                        </div>
                      </div>
                      <StatusPill tone={device.tone}>
                        {device.tone === "success"
                          ? "Ok"
                          : device.tone === "warning"
                            ? "Atención"
                            : "Requiere acción"}
                      </StatusPill>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4 lg:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descargas pendientes</CardTitle>
                    <CardDescription>Preparadas para instalar de forma segura.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {downloads.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-lg border bg-background p-3"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.version} · {item.size}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="size-4" />
                          Instalar
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Seguridad</CardTitle>
                      <CardDescription>Verificación de integridad y firmas.</CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Cog className="size-3" />
                      Configurar
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Descargas verificadas", value: "128" },
                      { label: "Bloqueos preventivos", value: "6" },
                      { label: "Reportes generados", value: "12" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                      >
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="text-lg font-semibold">{item.value}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                          <Settings2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default AppShell
