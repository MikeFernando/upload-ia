import React from "react";
import { FileVideo, Upload } from "lucide-react";

import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

import { Separator } from "@radix-ui/react-separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { api } from "@/lib/api";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success';

interface Props {
  onVideoUploaded: (id: string) => void;
}

const statusMessage = {
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Sucesso!'
}

export function VideoInputForm(props: Props) {
  const [videoFile, setVideoFile] = React.useState<File | null>(null)
  const [status, setStatus] = React.useState<Status>('waiting')
  
  const promptInputRef = React.useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) return;

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('convert started')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', (progress) => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100));
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('convert finished.')

    return audioFile
  }

  async function handleUploadVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) return

    // convert video in audio
    setStatus('converting')
    const audioFile = await convertVideoToAudio(videoFile)
    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')
    const response = await api.post('/videos', data)

    const videoId = response.data.video.id
    setStatus('generating')
    await api.post(`/videos/${videoId}/transcription`, {
      prompt
    })

    setStatus('success')

    props.onVideoUploaded(videoId)
  }

  const previewURL = React.useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])


  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label 
        htmlFor="video"
        className="relative flex flex-col items-center justify-center gap-2 overflow-hidden text-sm border border-dashed rounded-md cursor-pointer aspect-video text-muted-foreground hover:bg-primary/5" 
      >
       {previewURL 
        ? (<video 
            src={previewURL} 
            controls={false} 
            className="absolute inset-0 pointer-events-none" 
          />) 
        : (
            <>
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo
            </>
        )}
      </label>
      <input 
        type="file" 
        id="video" 
        accept="video/mp4" 
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          id="transcription_prompt" 
          placeholder="Inclua palavras-chaves mencionadas no vídeo separadas por vírgula (,)"
          className="h-20 leading-relaxed resize-none"
          />
      </div>

      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'} 
        type="submit" 
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {status === 'waiting' 
        ? (<>
            <Upload className="w-4 h-4 ml-2" />
            Carregar video
          </>)
        : statusMessage[status]}
      </Button>
    </form>
  )
}
