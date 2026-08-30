import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { ChatMessage } from '@hospate/types';
import { Sparkles, FileText, Bot } from 'lucide-react-native';

interface AIMessageProps {
  message: ChatMessage;
  onSelectPrompt?: (prompt: string) => void;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message, onSelectPrompt }) => {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.assistantWrapper]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Sparkles size={14} color="#FFFFFF" />
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser && styles.userText]}>
          {message.text}
        </Text>

        {/* Source Citations */}
        {message.sources && message.sources.length > 0 && (
          <View style={styles.sourcesContainer}>
            <Text style={styles.sourcesLabel}>VERIFIED SOURCES:</Text>
            {message.sources.map((s, idx) => (
              <View key={idx} style={styles.sourceChip}>
                <FileText size={12} color={colors.accent} />
                <Text style={styles.sourceText}>
                  {s.title} • {s.date} {s.parameter ? `(${s.parameter})` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Suggested Quick Prompts */}
        {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
          <View style={styles.promptsContainer}>
            <Text style={styles.promptsLabel}>SUGGESTED QUESTIONS:</Text>
            {message.suggestedQuestions.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => onSelectPrompt && onSelectPrompt(q)}
                style={styles.promptPill}
              >
                <Text style={styles.promptText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md
  },
  userWrapper: {
    justifyContent: 'flex-end'
  },
  assistantWrapper: {
    justifyContent: 'flex-start'
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 4
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: borderRadius.lg,
    padding: spacing.md
  },
  userBubble: {
    backgroundColor: colors.primaryDark,
    borderBottomRightRadius: borderRadius.xs
  },
  assistantBubble: {
    backgroundColor: colors.surfaceElevated,
    borderBottomLeftRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)'
  },
  text: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22
  },
  userText: {
    color: '#FFFFFF'
  },
  sourcesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)'
  },
  sourcesLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.accent,
    marginBottom: 4
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginTop: 3
  },
  sourceText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1
  },
  promptsContainer: {
    marginTop: spacing.md
  },
  promptsLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 4
  },
  promptPill: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    marginTop: 4
  },
  promptText: {
    ...typography.captionSemibold,
    color: colors.primary
  }
});
