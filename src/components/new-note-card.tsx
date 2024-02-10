import * as Dialog from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps){
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor(){
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if (event.target.value === '')
    {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content !== '')
    {
      onNoteCreated(content)
  
      setContent('')
      setShouldShowOnboarding(true)
  
      toast.success('Nota criada com sucesso!')
    } else {
      toast.error('Nota vazia, por favor preencha o campo')
    }
  }

  function handleStartRecording() {

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

      if (!isSpeechRecognitionAPIAvailable){
        alert('Infelizmente seu navegador não suporta a API de gravação!')
        return
      }

      setIsRecording(true)
      setShouldShowOnboarding(false)

      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      speechRecognition = new SpeechRecognitionAPI()

      speechRecognition.lang = 'pt-BR'
      speechRecognition.continuous = true
      speechRecognition.maxAlternatives = 1
      speechRecognition.interimResults = true

      speechRecognition.onresult = (event) => {
        const transcription = Array.from(event.results).reduce((text, result) => {
          return text.concat(result[0].transcript)
        }, '')

        setContent(transcription)
      }

      speechRecognition.onerror = (event) => {
        console.log(event.error)
      }

      speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if(speechRecognition !== null) {
      speechRecognition.stop()
      speechRecognition = null
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='flex flex-col text-left rounded-md bg-slate-700 p-5 gap-3 overflow-hidden hover:ring-2 hover:ring-slate-300 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
        <span className='text-sm font-medium text-slate-200'>
        Adicionar nota
        </span>
        <p className='text-sm leading-6 text-slate-400'>
        Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
        <Dialog.Content className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none overflow-hidden'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <IoClose className='size-5' />
          </Dialog.Close>
          <form className='flex flex-1 flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5 '>
              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (<p className='text-sm leading-6  text-slate-400'>
                Comece <button 
                  className='font-medium text-lime-400   hover:underline'
                  onClick={handleStartRecording}
                  type='button'
                  >gravando uma nota</button> em áudio ou se preferir   <button 
                  className='font-medium text-lime-400 hover:underline'
                  onClick={handleStartEditor}
                  type='button'
                >utilize apenas texto.</button>
              </p>) : (
              <>    
                <button 
                  className='absolute left-0 top-0'
                >
                  {/* <IoChevronBackCircle className='size-5' /> 
                      Voltar*/}
                </button>
                <textarea 
                  autoFocus 
                  className='text-sm leading-6 text-slate-400 bg-transparent    resize-none flex-1 outline-none'
                  onChange={handleContentChanged}
                  value={content}
                />
                </>
              )}
            </div>

            {isRecording ? (
              <button 
                type="button"
                className='flex items-center justify-center gap-2 w-full bg-slate-900 py-4 text-center text-sm text-slate-300  outline-none font-medium hover:bg-slate-100'
                onClick={handleStopRecording}
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                Gravando! (clique p/ interromper)
              </button>
            ) : <button 
                type="button"
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950      outline-none font-medium hover:bg-lime-500'
                onClick={handleSaveNote}
              >
                Salvar nota
              </button>}    
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}