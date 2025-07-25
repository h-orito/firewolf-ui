import { Card } from '@/components/ui/card'

interface OrganizationSectionProps {
  organization: string
  onOrganizationChange: (organization: string) => void
}

export function OrganizationSection({
  organization,
  onOrganizationChange,
}: OrganizationSectionProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">役職構成</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">構成</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={organization}
            onChange={(e) => onOrganizationChange(e.target.value)}
            required
          >
            <option value="8人村">8人村</option>
            <option value="11人村">11人村</option>
            <option value="15人村">15人村</option>
            <option value="17人村">17人村</option>
            <option value="22人村">22人村</option>
          </select>
        </div>
      </div>
    </Card>
  )
}
