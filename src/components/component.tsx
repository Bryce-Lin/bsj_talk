"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { useSearchParams } from 'next/navigation'

interface Contestant {
  id: number
  name: string
  avatar: string
  votes: number
}

export function Component() {
  const [contestant, setContestant] = useState<Contestant | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const contestantId = searchParams.get('id')

  useEffect(() => {
    if (contestantId) {
      fetchContestant(parseInt(contestantId))
      checkIfVoted(parseInt(contestantId))
    }
  }, [contestantId])

  const fetchContestant = async (id: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/contestants/${id}`)
      if (!response.ok) {
        throw new Error('选手信息获取失败')
      }
      const data = await response.json()
      setContestant(data)
    } catch (err) {
      setError('获取选手信息时出错')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfVoted = (id: number) => {
    const votedContestants = JSON.parse(localStorage.getItem('votedContestants') || '[]')
    setHasVoted(votedContestants.includes(id))
  }

  const handleVote = async () => {
    if (!contestant || hasVoted) return

    try {
      const response = await fetch(`/api/contestants/${contestant.id}/vote`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('投票失败')
      }
      const updatedContestant = await response.json()
      setContestant(updatedContestant)
      setHasVoted(true)

      // 记录已投票的选手ID
      const votedContestants = JSON.parse(localStorage.getItem('votedContestants') || '[]')
      localStorage.setItem('votedContestants', JSON.stringify([...votedContestants, contestant.id]))
    } catch (err) {
      setError('投票时出错')
      console.error(err)
    }
  }

  if (isLoading) return <div className="text-center">加载中...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>
  if (!contestant) return <div className="text-center">未找到选手信息</div>

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-400 to-pink-500 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">为你喜欢的脱口秀选手投票</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <img src={contestant.avatar} alt={contestant.name} className="mb-4 size-40 rounded-full border-4 border-purple-500" />
          <h2 className="mb-4 text-xl font-semibold">{contestant.name}</h2>
          <p className="mb-6 text-lg">当前票数: {contestant.votes}</p>
          <Button
            onClick={handleVote}
            disabled={hasVoted}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-6 text-lg font-bold transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
          >
            {hasVoted ? "已投票" : "投票"}
            <Sparkles className="ml-2 size-5" />
          </Button>
          {hasVoted && (
            <p className="mt-4 font-semibold text-green-600">感谢您的投票！</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
