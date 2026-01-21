import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

export function SettingsView() {
  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Administra tus preferencias de la aplicación y apariencia.
        </p>
      </div>
      <Separator />

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Apariencia</h3>
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>
              Selecciona el tema de la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Modo de color</Label>
              <p className="text-sm text-muted-foreground">
                Cambia entre modo claro y oscuro.
              </p>
            </div>
            <ModeToggle />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Aplicación</h3>
        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Configura cómo quieres recibir alertas de drivers.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-1">
                <Label htmlFor="notifications">Activar notificaciones</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas cuando haya nuevos controladores disponibles.
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-1">
                <Label htmlFor="auto-download">Descarga automática</Label>
                <p className="text-sm text-muted-foreground">
                  Descargar controladores críticos automáticamente.
                </p>
              </div>
              <Switch id="auto-download" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-card/50 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Información</CardTitle>
            <CardDescription>Detalles de la versión instalada.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Versión</span>
              <span className="text-sm text-muted-foreground">
                v0.1.0 (Beta)
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
