import { DemoAccessForm } from "@/components/demo/DemoAccessForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">ELEVA</h1>
          <p className="text-sm text-muted-foreground">El sistema de tu centro: operación, decisión y comunidad.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Ambiente demo
          </h2>
          <DemoAccessForm />
        </div>
      </div>
    </div>
  )
}
