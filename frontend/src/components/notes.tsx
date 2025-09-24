/**
 * NOTES COMPONENT
 * 
 * Features:
 * - Create, edit, and delete personal notes
 * - Search functionality across note titles and content
 * - Inline editing with save/cancel options
 * - Clean card-based layout
 * 
 * Backend API Endpoints Required:
 * - GET    /api/notes              // Get all notes
 * - POST   /api/notes              // Create note { title, content }
 * - PUT    /api/notes/:id          // Update note { title, content }
 * - DELETE /api/notes/:id          // Delete note
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Save, X } from "lucide-react"

export function Notes() {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [isLoading, setIsLoading] = useState(false)

  // Load notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/notes')
      const data = await response.json()
      if (data.notes) {
        setNotes(data.notes)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content
        }),
      })
      
      const data = await response.json()
      if (data.note) {
        setNotes([data.note, ...notes])
        setNewNote({ title: "", content: "" })
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Error creating note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateNote = async (id, updatedNote) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:4000/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      })
      
      const data = await response.json()
      if (data.note) {
        setNotes(notes.map(note => note.id === id ? data.note : note))
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error updating note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    
    setIsLoading(true)
    try {
      await fetch(`http://localhost:4000/api/notes/${id}`, {
        method: 'DELETE',
      })
      
      setNotes(notes.filter(note => note.id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notes</h1>
          <p className="text-muted-foreground">
            Create and manage your personal notes.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create New Note */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-[200px]"
            />
            <div className="flex gap-2">
              <Button 
                onClick={createNote}
                disabled={!newNote.title.trim() || !newNote.content.trim() || isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Note"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false)
                  setNewNote({ title: "", content: "" })
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="grid gap-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No notes found matching your search." : "No notes yet. Create your first note!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={editingId === note.id}
              onEdit={() => setEditingId(note.id)}
              onSave={(updatedNote) => updateNote(note.id, updatedNote)}
              onCancel={() => setEditingId(null)}
              onDelete={() => deleteNote(note.id)}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </div>
  )
}

function NoteCard({ note, isEditing, onEdit, onSave, onCancel, onDelete, isLoading }) {
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) return
    onSave({ title: editTitle, content: editContent })
  }

  const handleCancel = () => {
    setEditTitle(note.title)
    setEditContent(note.content)
    onCancel()
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-lg font-semibold"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[150px]"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={!editTitle.trim() || !editContent.trim() || isLoading}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={handleCancel} size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{note.title}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
        {note.createdAt && (
          <p className="text-xs text-muted-foreground mt-4">
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}