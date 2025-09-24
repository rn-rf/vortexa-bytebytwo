/**
 * FLASHCARDS COMPONENT
 * 
 * Features:
 * - Create, edit, and delete flashcards (question/answer pairs)
 * - Interactive flip cards (click to reveal question/answer)
 * - Study Mode - full-screen flashcard review with navigation
 * - Search functionality across questions and answers
 * - Progress indicators and card navigation in study mode
 * 
 * Backend API Endpoints Required:
 * - GET    /api/flashcards         // Get all flashcards
 * - POST   /api/flashcards         // Create flashcard { question, answer }
 * - PUT    /api/flashcards/:id     // Update flashcard { question, answer }
 * - DELETE /api/flashcards/:id     // Delete flashcard
 */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit2, Trash2, Save, X, RotateCcw, Play, ChevronLeft, ChevronRight } from "lucide-react"

export function Flashcards() {
  const [flashcards, setFlashcards] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newFlashcard, setNewFlashcard] = useState({ question: "", answer: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    fetchFlashcards()
  }, [])

  const fetchFlashcards = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/flashcards')
      const data = await response.json()
      if (data.flashcards) {
        setFlashcards(data.flashcards)
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createFlashcard = async () => {
    if (!newFlashcard.question.trim() || !newFlashcard.answer.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newFlashcard.question,
          answer: newFlashcard.answer
        }),
      })
      
      const data = await response.json()
      if (data.flashcard) {
        setFlashcards([data.flashcard, ...flashcards])
        setNewFlashcard({ question: "", answer: "" })
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Error creating flashcard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFlashcard = async (id, updatedFlashcard) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:4000/api/flashcards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFlashcard),
      })
      
      const data = await response.json()
      if (data.flashcard) {
        setFlashcards(flashcards.map(card => card.id === id ? data.flashcard : card))
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error updating flashcard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFlashcard = async (id) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return
    
    setIsLoading(true)
    try {
      await fetch(`http://localhost:4000/api/flashcards/${id}`, {
        method: 'DELETE',
      })
      
      setFlashcards(flashcards.filter(card => card.id !== id))
    } catch (error) {
      console.error('Error deleting flashcard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startStudyMode = () => {
    if (filteredFlashcards.length === 0) return
    setStudyMode(true)
    setCurrentCardIndex(0)
    setShowAnswer(false)
  }

  const exitStudyMode = () => {
    setStudyMode(false)
    setCurrentCardIndex(0)
    setShowAnswer(false)
  }

  const nextCard = () => {
    if (currentCardIndex < filteredFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowAnswer(false)
    }
  }

  const filteredFlashcards = flashcards.filter(card =>
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (studyMode) {
    const currentCard = filteredFlashcards[currentCardIndex]
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Mode</h1>
            <p className="text-muted-foreground">
              Card {currentCardIndex + 1} of {filteredFlashcards.length}
            </p>
          </div>
          <Button variant="outline" onClick={exitStudyMode}>
            <X className="w-4 h-4 mr-2" />
            Exit Study
          </Button>
        </div>

        <Card className="min-h-[400px]">
          <CardContent className="p-8 flex flex-col justify-center items-center text-center space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                {showAnswer ? "Answer" : "Question"}
              </h3>
              <div className="text-2xl font-medium">
                {showAnswer ? currentCard.answer : currentCard.question}
              </div>
            </div>
            
            <Button 
              onClick={() => setShowAnswer(!showAnswer)}
              className="mt-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {showAnswer ? "Show Question" : "Show Answer"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevCard} 
            disabled={currentCardIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-1">
            {filteredFlashcards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentCardIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={nextCard} 
            disabled={currentCardIndex === filteredFlashcards.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
          <p className="text-muted-foreground">
            Create and study with flashcards to improve your learning.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={startStudyMode} 
            disabled={filteredFlashcards.length === 0}
          >
            <Play className="w-4 h-4 mr-2" />
            Study ({filteredFlashcards.length})
          </Button>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
            <Plus className="w-4 h-4 mr-2" />
            New Card
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search flashcards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create New Flashcard */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Flashcard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Question</label>
              <Textarea
                placeholder="Enter your question..."
                value={newFlashcard.question}
                onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Answer</label>
              <Textarea
                placeholder="Enter the answer..."
                value={newFlashcard.answer}
                onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={createFlashcard}
                disabled={!newFlashcard.question.trim() || !newFlashcard.answer.trim() || isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Flashcard"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false)
                  setNewFlashcard({ question: "", answer: "" })
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredFlashcards.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No flashcards found matching your search." : "No flashcards yet. Create your first flashcard!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFlashcards.map((card) => (
            <FlashcardItem
              key={card.id}
              flashcard={card}
              isEditing={editingId === card.id}
              onEdit={() => setEditingId(card.id)}
              onSave={(updatedCard) => updateFlashcard(card.id, updatedCard)}
              onCancel={() => setEditingId(null)}
              onDelete={() => deleteFlashcard(card.id)}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </div>
  )
}

function FlashcardItem({ flashcard, isEditing, onEdit, onSave, onCancel, onDelete, isLoading }) {
  const [editQuestion, setEditQuestion] = useState(flashcard.question)
  const [editAnswer, setEditAnswer] = useState(flashcard.answer)
  const [flipped, setFlipped] = useState(false)

  const handleSave = () => {
    if (!editQuestion.trim() || !editAnswer.trim()) return
    onSave({ question: editQuestion, answer: editAnswer })
  }

  const handleCancel = () => {
    setEditQuestion(flashcard.question)
    setEditAnswer(flashcard.answer)
    onCancel()
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Edit Flashcard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Question</label>
            <Textarea
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Answer</label>
            <Textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={!editQuestion.trim() || !editAnswer.trim() || isLoading}
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
    <Card className="cursor-pointer transition-transform hover:scale-105" onClick={() => setFlipped(!flipped)}>
      <CardHeader>
        <CardTitle className="flex justify-between items-start text-base">
          <span className="text-sm text-muted-foreground">
            {flipped ? "Answer" : "Question"}
          </span>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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
        <p className="text-sm whitespace-pre-wrap min-h-[60px] flex items-center">
          {flipped ? flashcard.answer : flashcard.question}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-muted-foreground">
            Click to flip
          </p>
          <div className="flex gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${flipped ? 'bg-muted' : 'bg-primary'}`} />
            <div className={`w-1.5 h-1.5 rounded-full ${flipped ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>
        {flashcard.createdAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Created: {new Date(flashcard.createdAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}