export function NoteCard(){
  return (
    <button className='text-left rounded-md bg-slate-800 p-5 space-y-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none '>
          <span className='text-sm font-medium text-slate-300'>
            há 2 dias
          </span>
          <p className='text-sm leading-6 text-slate-400'>
            loessetsttat aetataetateas et ata ealoessetsttat aetataetateas et ata ea asGrave uma nota em áudio que será convertida para texto au
          </p>
          <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'/>
    </button>
  )
}