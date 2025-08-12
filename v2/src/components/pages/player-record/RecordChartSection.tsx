'use client'

import { Card } from '@/components/ui/Card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { components } from '@/types/generated/api'

type CampRecord = components['schemas']['CampRecord']
type SkillRecord = components['schemas']['SkillRecord']

interface RecordChartSectionProps {
  campRecordList: CampRecord[]
  skillRecordList: SkillRecord[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export function RecordChartSection({ campRecordList, skillRecordList }: RecordChartSectionProps) {
  const campChartData = campRecordList.map((record) => ({
    name: record.camp.name,
    participateCount: record.participate_count,
    winCount: record.win_count,
    winRate: record.win_rate * 100,
  }))

  const skillChartData = skillRecordList.map((record) => ({
    name: record.skill.name,
    participateCount: record.participate_count,
    winCount: record.win_count,
    winRate: record.win_rate * 100,
  }))

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">陣営別戦績</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">参加・勝利回数</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(_value, name) => [
                    name === 'participateCount' ? `${_value}回` : `${_value}回`,
                    name === 'participateCount' ? '参加' : '勝利',
                  ]}
                />
                <Bar dataKey="participateCount" fill="#8884d8" name="participateCount" />
                <Bar dataKey="winCount" fill="#82ca9d" name="winCount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">陣営別参加割合</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, participateCount }) => `${name}: ${participateCount}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="participateCount"
                >
                  {campChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}回`, '参加回数']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">陣営別統計</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">陣営</th>
                  <th className="text-right p-2">参加回数</th>
                  <th className="text-right p-2">勝利回数</th>
                  <th className="text-right p-2">勝率</th>
                </tr>
              </thead>
              <tbody>
                {campRecordList.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{record.camp.name}</td>
                    <td className="text-right p-2">{record.participate_count}</td>
                    <td className="text-right p-2">{record.win_count}</td>
                    <td className="text-right p-2">{(record.win_rate * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">役職別戦績</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">役職別勝率</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={skillChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '勝率']} />
              <Bar dataKey="winRate" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">役職別統計</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">役職</th>
                  <th className="text-right p-2">参加回数</th>
                  <th className="text-right p-2">勝利回数</th>
                  <th className="text-right p-2">勝率</th>
                </tr>
              </thead>
              <tbody>
                {skillRecordList.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{record.skill.name}</td>
                    <td className="text-right p-2">{record.participate_count}</td>
                    <td className="text-right p-2">{record.win_count}</td>
                    <td className="text-right p-2">{(record.win_rate * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
