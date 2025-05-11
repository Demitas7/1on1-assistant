import { OneOnOne, Member } from '../../generated/prisma';

/**
 * 1on1記録からコーチングアドバイスを生成するためのプロンプトを作成
 */
export function createCoachingAdvicePrompt(oneOnOne: OneOnOne, member: Member) {
  return `
# 1on1ミーティング分析

## メンバー情報
- 名前: ${member.name}
- 役職: ${member.jobTitle}

## 1on1記録
- 日付: ${oneOnOne.date.toISOString().split('T')[0]}
- 会話内容:
${oneOnOne.content}
- 次のアクション:
${oneOnOne.nextActions || '特になし'}

## 指示
上記の1on1ミーティング記録を分析し、以下の内容を含むアドバイスを提供してください：

1. ミーティングの要点のまとめ（箇条書き3-5項目）
2. コーチング視点からの分析（メンバーの状態・意欲・スキルレベルの評価）
3. マネージャーへの具体的なアドバイス（次回の1on1で試すべき質問や対応）
4. SL理論に基づいた適切なリーダーシップスタイルの提案

回答はマークダウン形式で、日本語で簡潔に提供してください。
`;
}

/**
 * 複数の1on1記録からマネジメントスタイル分析のためのプロンプトを作成
 */
export function createManagementStyleAnalysisPrompt(oneOnOnes: OneOnOne[], member: Member) {
  // 1on1記録の内容を整形
  const sessionsSummary = oneOnOnes
    .map((session) => {
      return `
日付: ${session.date.toISOString().split('T')[0]}
内容: ${session.content.slice(0, 200)}${session.content.length > 200 ? '...' : ''}
`;
    })
    .join('\n');

  return `
# マネジメントスタイル分析

## メンバー情報
- 名前: ${member.name}
- 役職: ${member.jobTitle}
- 1on1セッション数: ${oneOnOnes.length}件

## 1on1記録サマリー
${sessionsSummary}

## 指示
上記の複数の1on1ミーティング記録を分析し、このマネージャーのマネジメントスタイルについて以下の観点から評価してください：

1. コミュニケーションの特徴（指示型/質問型/傾聴型）
2. フィードバックの特徴（ポジティブ/改善点）のバランス
3. リーダーシップスタイル（指示的/支援的）の傾向
4. 強みと改善の機会
5. マネジメントスタイル改善のための3つの具体的なアドバイス

回答はマークダウン形式で、日本語で簡潔に提供してください。
`;
}

/**
 * 次回の1on1で試すべき質問リストを生成するためのプロンプト
 */
export function createNextSessionQuestionsPrompt(oneOnOne: OneOnOne, member: Member) {
  return `
# 次回1on1の質問リスト生成

## メンバー情報
- 名前: ${member.name}
- 役職: ${member.jobTitle}

## 直近の1on1記録
- 日付: ${oneOnOne.date.toISOString().split('T')[0]}
- 会話内容:
${oneOnOne.content}
- 次のアクション:
${oneOnOne.nextActions || '特になし'}

## 指示
上記の1on1ミーティング記録を基に、次回の1on1で使用できる効果的な質問リストを作成してください。
以下のカテゴリに分けて、各カテゴリ3-5個の質問を提案してください：

1. 前回のフォローアップ質問
2. キャリア開発に関する質問
3. チャレンジや障壁に関する質問
4. モチベーションやエンゲージメントに関する質問
5. 将来の展望に関する質問

質問はコーチング型の開かれた質問（Yes/Noでは答えられない質問）を中心に、メンバーの自己認識や内省を促すものにしてください。
回答はマークダウン形式で、日本語で簡潔に提供してください。
`;
}

export function createOverallManagementStyleAnalysisPrompt(oneOnOnes: any[]) {
  // oneOnOneオブジェクトからメンバー情報とセッションデータを抽出
  // メンバーごとにグループ化
  const memberMap = new Map<number, {
    memberId: number;
    memberName: string;
    jobTitle: string;
    skills?: string | null;
    strengths?: string | null;
    weaknesses?: string | null;
    growthPlan?: string | null;
    sessions: Array<{
      id: number;
      date: string;
      content: string;
      nextActions: string | null;
    }>;
  }>();
  
  oneOnOnes.forEach(item => {
    const { member, ...session } = item;
    
    if (!memberMap.has(member.id)) {
      memberMap.set(member.id, {
        memberId: member.id,
        memberName: member.name,
        jobTitle: member.jobTitle,
        skills: member.skills,
        strengths: member.strengths,
        weaknesses: member.weaknesses,
        growthPlan: member.growthPlan,
        sessions: []
      });
    }
    
    memberMap.get(member.id)?.sessions.push({
      id: session.id,
      date: session.date.toISOString().split('T')[0],
      content: session.content,
      nextActions: session.nextActions
    });
  });

  // 分析用データの整形
  const members = Array.from(memberMap.values());
  const sessions: Array<{
    memberName: string;
    jobTitle: string;
    memberId: number;
    skills?: string | null;
    strengths?: string | null;
    weaknesses?: string | null;
    growthPlan?: string | null;
    date: string;
    content: string;
    nextActions: string | null;
  }> = [];
  
  members.forEach(member => {
    member.sessions.forEach(session => {
      sessions.push({
        memberName: member.memberName,
        jobTitle: member.jobTitle,
        memberId: member.memberId,
        skills: member.skills,
        strengths: member.strengths,
        weaknesses: member.weaknesses,
        growthPlan: member.growthPlan,
        date: session.date,
        content: session.content,
        nextActions: session.nextActions
      });
    });
  });
  
  // 統計データ
  const totalSessions = sessions.length;
  const memberCount = members.length;
  const dates = sessions.map(s => s.date).sort();
  const earliestDate = dates[0];
  const latestDate = dates[dates.length - 1];
  
  return `
あなたはプロフェッショナルなマネジメントコーチです。以下の1on1セッション記録を分析して、総合的なマネジメントスタイルの分析をお願いします。
マネジメントスタイルの分析では、SL理論（状況対応リーダーシップ理論）とコーチング理論に基づいたフィードバックを提供してください。

### 分析対象データの概要
- 総セッション数: ${totalSessions}
- 対象メンバー数: ${memberCount}
- 分析期間: ${earliestDate} ～ ${latestDate}

### 1on1セッション記録
${sessions.map(session => `
---
メンバー名: ${session.memberName}
役職: ${session.jobTitle}
${session.skills ? `スキル: ${session.skills}` : ''}
${session.strengths ? `得意なこと: ${session.strengths}` : ''}
${session.weaknesses ? `不得意なこと: ${session.weaknesses}` : ''}
${session.growthPlan ? `育成プラン: ${session.growthPlan}` : ''}
日付: ${session.date}
会話内容:
${session.content}
次のアクション:
${session.nextActions || '(記載なし)'}
`).join('\n')}

### 分析結果のフォーマット
以下の内容を含むマークダウン形式で分析結果を出力してください：

1. 総合的なマネジメントスタイルの概要（200-300文字程度）
2. SL理論に基づくリーダーシップスタイルの分析
   - 各メンバーへの対応スタイル
   - 全体的な傾向
   - バランスの評価
3. コミュニケーションパターンの分析
   - 使用頻度の高い技法や表現
   - 効果的なコミュニケーション例
   - 改善の余地がある点
4. メンバーの特性に合わせたアプローチの評価
   - スキルや経験に応じた対応の適切さ
   - メンバーの得意・不得意を考慮したコミュニケーション
   - 育成プランとの整合性
5. 今後の推奨アクション（3-5項目）
   - マネジメントスタイルの改善提案
   - メンバー別のアプローチ調整案
   - 効果的な質問技法

最後に、分析全体を通して得られた重要なインサイトを簡潔にまとめてください。
`;
} 