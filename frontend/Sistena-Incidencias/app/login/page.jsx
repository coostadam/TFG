"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LockKeyhole, Mail, User, Phone, MapPin, AtSign } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [error, setError] = useState("")


  // Estados para el formulario de registro
  const [nombre, setNombre] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [telefono, setTelefono] = useState("")
  const [usuario, setUsuario] = useState("")
  const [direccion, setDireccion] = useState("")
  const [emailRegistro, setEmailRegistro] = useState("")
  const [passwordRegistro, setPasswordRegistro] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registroError, setRegistroError] = useState("")

  // Inicializar usuarios demo en localStorage si no existen
  useEffect(() => {
    const usuariosGuardados = localStorage.getItem("usuarios")

    if (!usuariosGuardados) {
      // Usuarios demo predefinidos
      const usuariosDemo = [
        {
          id: 1,
          nombre: "Admin",
          apellidos: "Sistema",
          email: "admin@example.com",
          password: "password",
          telefono: "600123456",
          usuario: "admin",
          direccion: "Calle Admin 1",
          tipo: "admin",
        },
        {
          id: 2,
          nombre: "Técnico",
          apellidos: "Soporte",
          email: "tecnico@example.com",
          password: "password",
          telefono: "600234567",
          usuario: "tecnico",
          direccion: "Calle Técnico 1",
          tipo: "tecnico",
        },
        {
          id: 3,
          nombre: "Gestor",
          apellidos: "Proyectos",
          email: "gestor@example.com",
          password: "password",
          telefono: "600345678",
          usuario: "gestor",
          direccion: "Calle Gestor 1",
          tipo: "gestor",
        },
        {
          id: 4,
          nombre: "Usuario",
          apellidos: "Final",
          email: "usuario@example.com",
          password: "password",
          telefono: "600456789",
          usuario: "usuario",
          direccion: "Calle Usuario 1",
          tipo: "usuario",
        },
      ]

      localStorage.setItem("usuarios", JSON.stringify(usuariosDemo))
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://192.168.1.147:8080/ServiceNow/resources/auth/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (res.ok) {

        if (!data) {
          setError("Respuesta inesperada del servidor");
          return;
        }
        localStorage.setItem("userRole", data.rol.toLowerCase());
        localStorage.setItem("userEmail", data.usuario);
        localStorage.setItem("userName", data.nombre);

        router.push("/dashboard");

      } else {
        setError(data?.mensaje || text || "Error desconocido");
      }
    } catch (e) {
      setError("Error de conexión con el servidor");
      console.error(e);
    }
  };




  const handleRegistro = async (e) => {
    e.preventDefault()
    setRegistroError("")

    if (passwordRegistro !== confirmPassword) {
      setRegistroError("Las contraseñas no coinciden")
      return
    }

    try {
      const response = await fetch("http://192.168.1.147:8080/ServiceNow/resources/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          nombre,
          apellido: apellidos,
          correo: emailRegistro,
          tlfno: telefono,
          password: passwordRegistro,
        }),
      })

      if (response.status === 409) {
        setRegistroError("El nombre de usuario ya está en uso")
        return
      }

      if (!response.ok) {
        setRegistroError("Error al registrar usuario")
        return
      }

      alert("Registro exitoso. Ya puedes iniciar sesión.")
      // Limpiar campos...
      setNombre("")
      setApellidos("")
      setTelefono("")
      setUsuario("")
      setDireccion("")
      setEmailRegistro("")
      setPasswordRegistro("")
      setConfirmPassword("")
      document.querySelector('[data-state="inactive"][value="login"]')?.click()
    } catch (err) {
      console.error(err)
      setRegistroError("No se pudo conectar al servidor.")
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <LockKeyhole className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sistema de Gestión de Incidencias</CardTitle>
          <CardDescription>Inicia sesión o crea una cuenta para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="registro">Crear Cuenta</TabsTrigger>
              <TabsTrigger value="demo">Cuentas Demo</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Nombre de usuario</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="email"
                      placeholder="Usuario01"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Iniciar Sesión
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="registro">
            <form onSubmit={handleRegistro} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      className="pl-10"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="apellidos"
                      type="text"
                      placeholder="Tus apellidos"
                      className="pl-10"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="600123456"
                    className="pl-10"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usuario">Nombre de Usuario</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="usuario"
                    type="text"
                    placeholder="usuario123"
                    className="pl-10"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="direccion"
                    type="text"
                    placeholder="Tu dirección"
                    className="pl-10"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailRegistro">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="emailRegistro"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="pl-10"
                    value={emailRegistro}
                    onChange={(e) => setEmailRegistro(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordRegistro">Contraseña</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="passwordRegistro"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={passwordRegistro}
                      onChange={(e) => setPasswordRegistro(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {registroError && <div className="text-red-500 text-sm">{registroError}</div>}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Registrarse
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="demo">
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-2">
                Utiliza estas cuentas para probar las diferentes vistas del sistema:
              </div>
              {[
                { role: "Administrador", email: "admin@example.com" },
                { role: "Técnico", email: "tecnico@example.com" },
                { role: "Gestor", email: "gestor@example.com" },
                { role: "Usuario Básico", email: "usuario@example.com" },
              ].map((account, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{account.role}</div>
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span>{account.email}</span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                      onClick={() => {
                        setEmail(account.email)
                        setPassword("password")
                      }}
                    >
                      Usar esta cuenta
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-500 mt-2">Contraseña para todas las cuentas: "password"</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">© 2025 Sistema de Gestión de Incidencias</p>
      </CardFooter>
    </Card>
    </div >
  )
}
