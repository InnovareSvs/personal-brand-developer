'use client'

import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  tagColor?: 'default' | 'red'
}

export function TagInput({ value, onChange, placeholder = 'Type and press Enter…', tagColor = 'default' }: TagInputProps) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim().replace(/,$/, '')
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const pillClass = tagColor === 'red'
    ? 'bg-red-50 text-red-700 border border-red-200'
    : 'bg-slate-100 text-slate-700 border border-slate-200'

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
      {value.map((tag) => (
        <span key={tag} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${pillClass}`}>
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="hover:opacity-60 transition-opacity leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder:text-slate-400"
      />
    </div>
  )
}
