'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DonationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>投げ銭について</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p className="text-sm">
            開発を応援してくださりありがとうございます。
            <br />
            投げ銭いただける方は以下のいずれかの方法でお願いします。
          </p>

          <div>
            <h3 className="font-semibold mb-2">Amazonほしいものリスト</h3>
            <div className="text-sm space-y-2">
              <p>Amazonほしいものリストから選んで開発者に送ることができます。</p>
              <a
                href="https://www.amazon.jp/hz/wishlist/ls/1KZSJAJS1ETW4?ref_=wl_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="sm" variant="default">
                  Amazonほしいものリスト
                </Button>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Amazonアソシエイト経由でお買い物</h3>
            <div className="text-sm space-y-2">
              <p>
                下記からAmazonに遷移してカートに追加＆購入すると、管理人に若干の紹介料が入ります。
              </p>
              <iframe
                src="https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=20&l=ez&f=ifr&linkID=c5438f7fc033eeee42260876403c6c51&t=wolfort0d-22&tracking_id=wolfort0d-22"
                width="120"
                height="90"
                scrolling="no"
                className="border-0"
                style={{ border: 'none' }}
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">補足</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                頂いた改善提案、ご要望については投げ銭の有無に関係なく積極的に取り入れていくので、X（旧Twitter）
                <a
                  href="https://x.com/ort_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  @ort_dev
                </a>
                までお願いします。
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
