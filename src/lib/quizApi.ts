import { supabase } from '@/integrations/supabase/client';
import { getQuestionsForStatus } from '@/data/questions';
import type { Json } from '@/integrations/supabase/types';

export function generateShareCode(nameA: string, nameB: string): string {
  const clean = (n: string) => n.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${clean(nameA)}-${clean(nameB)}-${rand}`;
}

export async function createQuizSession(data: {
  partnerAName: string;
  partnerBName: string;
  partnerAGender: string;
  partnerBGender: string;
  relationshipStatus: string;
}) {
  const shareCode = generateShareCode(data.partnerAName, data.partnerBName);
  
  const { data: session, error } = await supabase
    .from('quiz_sessions')
    .insert({
      share_code: shareCode,
      partner_a_name: data.partnerAName,
      partner_b_name: data.partnerBName,
      partner_a_gender: data.partnerAGender,
      partner_b_gender: data.partnerBGender,
      relationship_status: data.relationshipStatus,
      status: 'partner_a_in_progress',
    })
    .select()
    .single();

  if (error) throw error;
  return session;
}

export async function submitPartnerAnswers(
  sessionId: string,
  partner: 'a' | 'b',
  answers: Record<string, string>,
  score: number
) {
  const updateData: Record<string, Json | string | number> = {};
  
  if (partner === 'a') {
    updateData.partner_a_answers = answers as unknown as Json;
    updateData.partner_a_score = score;
    updateData.partner_a_completed_at = new Date().toISOString();
    updateData.status = 'waiting_for_b';
  } else {
    updateData.partner_b_answers = answers as unknown as Json;
    updateData.partner_b_score = score;
    updateData.partner_b_completed_at = new Date().toISOString();
    updateData.status = 'generating';
  }

  const { error } = await supabase
    .from('quiz_sessions')
    .update(updateData)
    .eq('id', sessionId);

  if (error) throw error;
}

export async function generateAIResult(sessionId: string) {
  const { data: session, error: fetchErr } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchErr || !session) throw fetchErr || new Error('Session not found');
  if (session.ai_result) return session.ai_result;

  const questions = getQuestionsForStatus(session.relationship_status as 'dating' | 'married' | 'livein');

  const { data: result, error: fnErr } = await supabase.functions.invoke('generate-result', {
    body: {
      partnerAName: session.partner_a_name,
      partnerBName: session.partner_b_name,
      partnerAGender: session.partner_a_gender,
      partnerBGender: session.partner_b_gender,
      relationshipStatus: session.relationship_status,
      partnerAAnswers: session.partner_a_answers,
      partnerBAnswers: session.partner_b_answers,
      questions: questions.map(q => ({
        id: q.id,
        categoryLabel: q.categoryLabel,
        categoryEmoji: q.categoryEmoji,
        questionText: q.questionText,
        options: q.options,
      })),
    },
  });

  if (fnErr) throw fnErr;

  // Cache result
  await supabase
    .from('quiz_sessions')
    .update({
      ai_result: result as unknown as Json,
      partner_a_score: result.partner_a_score,
      partner_b_score: result.partner_b_score,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  return result;
}

export async function getSessionByShareCode(shareCode: string) {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('share_code', shareCode)
    .single();

  if (error) throw error;
  return data;
}

export async function getSessionById(id: string) {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
