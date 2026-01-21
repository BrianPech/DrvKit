import { useState } from "react";
import {
  ClipboardCopy,
  Download,
  HardDrive,
  MonitorSmartphone,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Wifi,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { DashboardView } from "@/components/dashboard-view";
import { SettingsView } from "@/components/settings-view";
import { DeviceView } from "@/components/device-view";

type View = "dashboard" | "settings" | "devices";

const quickActions = [
  { label: "Escanear drivers", icon: Search },
  { label: "Actualizar todo", icon: RefreshCw },
  { label: "Crear copia", icon: ClipboardCopy },
];

function AppShell() {
  const [activeView, setActiveView] = useState<View>("dashboard");

  const menuItems = [
    {
      label: "Resumen",
      icon: ShieldCheck,
      id: "dashboard",
      active: activeView === "dashboard",
    },
    {
      label: "Dispositivos",
      icon: MonitorSmartphone,
      id: "devices",
      active: activeView === "devices",
    },
    { label: "Red y conectividad", icon: Wifi, id: "network", active: false },
    { label: "Almacenamiento", icon: HardDrive, id: "storage", active: false },
    {
      label: "Configuración",
      icon: Settings2,
      id: "settings",
      active: activeView === "settings",
    },
  ];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/40 text-foreground">
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <Sidebar className="border-r" side="left" collapsible="icon">
              <SidebarHeader>
                <div className="flex items-center justify-between rounded-lg bg-primary/5 p-2">
                  <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                    <ShieldCheck className="size-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">DrvKit</p>
                      <p className="text-xs text-muted-foreground">
                        Asistente de drivers
                      </p>
                    </div>
                  </div>
                  <SidebarTrigger aria-label="Toggle sidebar" />
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  <Input
                    placeholder="Buscar dispositivos..."
                    className="h-9 bg-sidebar/60"
                    aria-label="Buscar dispositivos"
                  />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Panel</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton
                            isActive={item.active}
                            tooltip={item.label}
                            onClick={() => {
                              if (
                                item.id === "dashboard" ||
                                item.id === "settings" ||
                                item.id === "devices"
                              ) {
                                setActiveView(item.id as View);
                              }
                            }}
                          >
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>Rápido</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="grid gap-2">
                      {quickActions.map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          className="justify-start gap-2"
                        >
                          <action.icon className="size-4" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <div className="group-data-[collapsible=icon]:hidden flex items-center justify-between rounded-lg border bg-muted/60 p-3">
                  <div>
                    <p className="text-sm font-semibold">Modo seguro</p>
                    <p className="text-xs text-muted-foreground">
                      Descargas verificadas
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[11px]">
                    Activo
                  </Badge>
                </div>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-background/80 backdrop-blur-sm overflow-hidden flex flex-col w-full">
              <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="hidden md:block text-xs uppercase tracking-widest text-muted-foreground">
                      {activeView === "dashboard"
                        ? "Estado"
                        : activeView === "devices"
                          ? "Hardware"
                          : "Preferencias"}
                    </p>
                    <h1 className="text-sm md:text-lg font-semibold">
                      {activeView === "dashboard"
                        ? "Sistema protegido y optimizado"
                        : activeView === "devices"
                          ? "Información del dispositivo"
                          : "Configuración del sistema"}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="size-4" />
                      Exportar
                    </Button>
                    <Button size="sm" className="gap-2">
                      <RefreshCw className="size-4" />
                      Sincronizar
                    </Button>
                  </div>
                  <ModeToggle />
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {activeView === "dashboard" && <DashboardView />}
                {activeView === "settings" && <SettingsView />}
                {activeView === "devices" && <DeviceView />}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}

export default AppShell;
