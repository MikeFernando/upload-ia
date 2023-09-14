import { useState } from 'react';
import { Github, Wand2 } from 'lucide-react'

import { useCompletion } from 'ai/react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { VideoInputForm } from './components/video-input-form'
import { PromptSelect } from './components/prompt-select';
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Slider } from "./components/ui/slider";
import { Label } from "./components/ui/label";

export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <h1 className="text-xl font-bold">upload.ui</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Desenvolvido com 💜 por Mike Fernando</span>
          
          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
          </div>
      </div>

      <main className="flex flex-1 gap-6 p-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid flex-1 grid-rows-2 gap-4">
            <Textarea 
              placeholder="Inclua um prompt para IA..." 
              className="p-4 leading-relaxed resize-none"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea 
              placeholder="Resultado gerado pela IA..." 
              className="p-4 leading-relaxed resize-none" 
              readOnly
              value={completion}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-400">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do video selecionado.
          </p>
        </div>
        <aside className="space-y-6 w-80">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="">Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="">Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue  />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>

              <span className="block text-xs text-muted-foreground">Você poderá customizar essa opção em breve</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
              />

              <span className="block text-xs leading-relaxed text-muted-foreground">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
