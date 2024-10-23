"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Upload, Loader2 } from "lucide-react"

interface Contestant {
  id: number
  name: string
  avatar: string
  votes: number
}

export function Component2() {
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [newName, setNewName] = useState('')
  const [newAvatar, setNewAvatar] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setNewAvatar(file)
      setIsUploading(false)
    }
  }

  const addContestant = async () => {
    if (newName && newAvatar) {
      setIsAdding(true)
      try {
        const formData = new FormData()
        formData.append('file', newAvatar)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('文件上传失败')
        }

        const { filepath } = await uploadResponse.json()

        const response = await fetch('/api/contestants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newName, avatar: filepath }),
        })

        if (!response.ok) {
          throw new Error('添加选手失败')
        }

        const newContestant = await response.json()
        setContestants([...contestants, newContestant])
        setNewName('')
        setNewAvatar(null)
        fetchContestants()
      } catch (error) {
        console.error('添加选手时出错:', error)
        // 这里可以添加错误处理，比如显示一个错误消息给用户
      } finally {
        setIsAdding(false)
      }
    }
  }

  const fetchContestants = async () => {
    try {
      const response = await fetch('/api/contestants')
      if (response.ok) {
        const data = await response.json()
        setContestants(data)
      } else {
        throw new Error('获取选手列表失败')
      }
    } catch (error) {
      console.error('获取选手列表失败:', error)
      // 这里可以添加错误处理，比如显示一个错误消息给用户
    }
  }

  useEffect(() => {
    fetchContestants()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">脱口秀投票系统管理</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>添加新选手</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="选手名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isAdding}
            />
            <div className="relative">
              <Input
                type="file"
                className="hidden"
                id="avatar-upload"
                onChange={handleFileUpload}
                disabled={isUploading || isAdding}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploading || isAdding}
              >
                {isUploading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 size-4" />
                )}
                {isUploading ? '上传中...' : '上传头像'}
              </Button>
            </div>
            <Button 
              onClick={addContestant} 
              disabled={isAdding || !newName || !newAvatar}
            >
              {isAdding ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 size-4" />
              )}
              {isAdding ? '添加中...' : '添加选手'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>选手列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>头像</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>票数</TableHead>
                <TableHead>投票二维码</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contestants.map((contestant) => (
                <TableRow key={contestant.id}>
                  <TableCell>{contestant.id}</TableCell>
                  <TableCell>
                    <img src={contestant.avatar} alt={contestant.name} className="size-10 rounded-full" />
                  </TableCell>
                  <TableCell>{contestant.name}</TableCell>
                  <TableCell>{contestant.votes}</TableCell>
                  <TableCell>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://bsj-talk-lxqf.vercel.app/?id=${contestant.id}`)}`} alt="QR Code" className="size-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
