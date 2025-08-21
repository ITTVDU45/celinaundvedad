'use client'

import { challenges, type Challenge } from '@/data/challenges'
import { useState } from 'react'

interface ChallengesListProps {
  onChallengeSelect: (challenge: Challenge) => void
  completedChallenges: string[]
}

export default function ChallengesList({ onChallengeSelect, completedChallenges }: ChallengesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gruppen' | 'fun' | 'aktion' | 'persoenlich' | 'selfie' | 'stimmung' | 'kreativ' | 'action' | 'highlights' | 'einzel'>('all')

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.category === selectedCategory)

  const categories = [
    { id: 'all', name: 'Alle', icon: '🎯' },
    { id: 'gruppen', name: 'Gruppen', icon: '🎯' },
    { id: 'fun', name: 'Fun', icon: '🎉' },
    { id: 'aktion', name: 'Aktion', icon: '💃' },
    { id: 'persoenlich', name: 'Persönlich', icon: '💖' },
    { id: 'selfie', name: 'Selfies', icon: '🤳' },
    { id: 'stimmung', name: 'Stimmung', icon: '🎶' },
    { id: 'kreativ', name: 'Kreativ', icon: '🌸' },
    { id: 'action', name: 'Action', icon: '😂' },
    { id: 'highlights', name: 'Highlights', icon: '🤳' },
    { id: 'einzel', name: 'Einzel', icon: '📷' }
  ] as const

  return (
    <div className="space-y-6">
      {/* Kategorie-Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-[#C9AD7F] to-[#A67C5B] text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Challenges-Liste */}
      <div className="space-y-3">
        {filteredChallenges.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id)
          
          return (
            <div
              key={challenge.id}
              className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                isCompleted ? 'border-2 border-green-200 bg-green-50/50' : 'border border-gray-200'
              }`}
              onClick={() => onChallengeSelect(challenge)}
            >
              <div className="flex items-center space-x-4">
                {/* Challenge-Icon */}
                <div className={`text-2xl ${isCompleted ? 'opacity-60' : ''}`}>
                  {challenge.icon}
                </div>
                
                {/* Challenge-Content */}
                <div className="flex-1">
                  <h3 className={`font-semibold text-gray-900 mb-1 ${
                    isCompleted ? 'line-through text-gray-500' : ''
                  }`}>
                    {challenge.title}
                  </h3>
                  <p className={`text-sm text-gray-600 ${
                    isCompleted ? 'text-gray-400' : ''
                  }`}>
                    {challenge.description}
                  </p>
                </div>
                
                {/* Status und Pfeil */}
                <div className="flex items-center space-x-2">
                  {isCompleted && (
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info-Text */}
      <div className="text-center text-sm text-gray-500 bg-white/60 rounded-lg p-3">
        <p>💡 Tipp: Du kannst zu jeder Challenge mehrere Fotos hochladen!</p>
      </div>
    </div>
  )
}
