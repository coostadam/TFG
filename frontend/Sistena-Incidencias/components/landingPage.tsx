import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Users, BarChart3, CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ServiceNow from "@/components/assets/image/serviceNow.png"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <Ticket className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold">Service-Now</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#inicio" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <Link href="#caracteristicas" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Características
          </Link>
          <Link href="#beneficios" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Beneficios
          </Link>
        </nav>
        <Link href="/login">
          <Button>Comenzar</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="inicio" className="w-full py-20 md:py-32 bg-gradient-to-br from-blue-50 to-white">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Gestiona tus tickets de soporte
              <span className="text-blue-600"> fácilmente</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Organiza, asigna y resuelve todos los tickets de tu empresa en una sola plataforma simple y poderosa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/login">
                <Button size="lg" className="h-12">
                  Prueba Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://www.youtube.com/watch?v=OEgqOWGEGVE" target="_blank">
              <Button variant="outline" size="lg" className="h-12">
                Ver Demo
              </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500"> • ✓ Configuración en 5 minutos</p>
          </div>
        </section>

        {/* Features Section */}
        <section id="caracteristicas" className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas</h2>
              <p className="text-xl text-gray-600">Herramientas simples para gestionar tu soporte eficientemente</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">Organización Simple</CardTitle>
                  <CardDescription className="text-base">
                    Todos tus tickets organizados automáticamente por prioridad y estado.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">Trabajo en Equipo</CardTitle>
                  <CardDescription className="text-base">
                    Asigna tickets a tu equipo y colabora en tiempo real.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">Reportes Claros</CardTitle>
                  <CardDescription className="text-base">
                    Ve el rendimiento de tu equipo con reportes fáciles de entender.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="w-full py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Mejora tu soporte al cliente</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Respuestas más rápidas</h3>
                      <p className="text-gray-600">
                        Reduce el tiempo de respuesta y mantén a tus clientes satisfechos.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Mejor organización</h3>
                      <p className="text-gray-600">Nunca pierdas un ticket y mantén todo bajo control.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Equipo más productivo</h3>
                      <p className="text-gray-600">
                        Herramientas que ayudan a tu equipo a trabajar más eficientemente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src={ServiceNow}
                  width={500}
                  height={400}
                  alt="Dashboard de TicketPro"
                  className="rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 md:px-6 border-t bg-gray-50 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ticket className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Service-Now</span>
        </div>
        <p className="text-sm text-gray-500">© 2025 Service-Now. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
