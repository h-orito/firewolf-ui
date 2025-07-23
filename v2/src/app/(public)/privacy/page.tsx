import { Card } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

        <Card className="p-8">
          <div className="prose prose-gray max-w-none">
            <div className="mb-6">
              <p className="text-gray-600">最終更新日: 2025年1月22日</p>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 個人情報の定義</h2>
                <p className="text-gray-700 leading-relaxed">
                  本プライバシーポリシーにおいて、「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、
                  生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により
                  特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの
                  当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 個人情報の収集方法</h2>
                <p className="text-gray-700 leading-relaxed">
                  当方は、ユーザーが利用登録をする際にニックネーム、メールアドレス、SNSアカウント情報などの個人情報をお尋ねすることがあります。
                  また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、
                  当方の提携先（情報提供元、広告主、広告配信先などを含みます。以下、「提携先」といいます。）などから収集することがあります。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. 個人情報を収集・利用する目的
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  当方が個人情報を収集・利用する目的は、以下のとおりです。
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>当方サービスの提供・運営のため</li>
                  <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                  <li>
                    ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当方が提供する他のサービスの案内のメールを送付するため
                  </li>
                  <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                  <li>
                    利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
                  </li>
                  <li>
                    ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
                  </li>
                  <li>上記の利用目的に付随する目的</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 利用目的の変更</h2>
                <p className="text-gray-700 leading-relaxed">
                  当方は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
                  利用目的の変更を行った場合には、変更後の目的について、当方所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 個人情報の第三者提供</h2>
                <p className="text-gray-700 leading-relaxed">
                  当方は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
                  ただし、個人情報保護法その他の法令で認められる場合を除きます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 個人情報の開示</h2>
                <p className="text-gray-700 leading-relaxed">
                  当方は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。
                  ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、
                  開示しない決定をした場合には、その旨を遅滞なく通知します。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. 個人情報の訂正および削除
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  ユーザーは、当方の保有する自己の個人情報が誤った情報である場合には、当方が定める手続きにより、
                  当方に対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookieの使用について</h2>
                <p className="text-gray-700 leading-relaxed">
                  当方のサービスは、ユーザーの利便性向上のためにCookieを使用することがあります。
                  Cookieの使用を希望されない場合は、ブラウザの設定によりCookieを無効にすることが可能です。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. プライバシーポリシーの変更
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
                  当方が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. お問い合わせ窓口</h2>
                <p className="text-gray-700 leading-relaxed">
                  本ポリシーに関するお問い合わせは、本サービス内のお問い合わせ機能をご利用ください。
                </p>
              </section>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
