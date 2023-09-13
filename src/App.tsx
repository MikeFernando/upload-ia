import { Button } from "./components/ui/button";
import { FileVideo, Github, Upload, Wand2 } from 'lucide-react'
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
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
            />
            <Textarea 
              placeholder="Resultado gerado pela IA..." 
              className="p-4 leading-relaxed resize-none" 
              readOnly 
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-400">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do video selecionado.
          </p>
        </div>
        <aside className="space-y-6 w-80">
          <form className="space-y-6">
            <label 
              htmlFor="video"
              className="flex flex-col items-center justify-center gap-2 text-sm border border-dashed rounded-md cursor-pointer aspect-video text-muted-foreground hover:bg-primary/5" 
            >
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo
            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only" />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
              <Textarea 
                id="transcription_prompt" 
                placeholder="Inclua palavras-chaves mencionadas no vídeo separadas por vírgula (,)"
                className="h-20 leading-relaxed resize-none"
               />
            </div>

            <Button type="submit" className="w-full">
              <Upload className="w-4 h-4 ml-2" />
              Carregar video
            </Button>
          </form>

          <Separator />

          <form className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="">Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="title">Título do YouTube</SelectItem>
                  <SelectItem value="description">Descrição do YouTube</SelectItem>
                </SelectContent>
              </Select>
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
              />

              <span className="block text-xs leading-relaxed text-muted-foreground">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
