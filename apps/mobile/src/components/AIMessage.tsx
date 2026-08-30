import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { ChatMessage } from '@hospate/types';
import { HospateLogo } from './HospateLogo';
import { FileText } from 'lucide-react-native';

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
          <HospateLogo size={16} />
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser && styles.userText]}>
          {message.text}
        </Text>

        {/* Source Citations */}
        {message.sources && message.sources.length > 0 && (
          <View style={styles.sourcesContainer}>
            <Text style={styles.sourcesLabel}>VERIFIED SOURCES</Text>
            {message.sources.map((s, idx) => (
              <View key={idx} style={styles.sourceChip}>
                <FileText size={12} color={colors.primary} />
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
            <Text style={styles.promptsLabel}>SUGGESTED QUESTIONS</Text>
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
    backgroundColor: colors.brandNavy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 4
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 18,
    padding: spacing.md
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4
  },
  assistantBubble: {
    backgroundColor: colors.surfaceElevated,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border
  },
  text: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 21
  },
  userText: {
    color: '#FFFFFF'
  },
  sourcesContainer: {
    marginTop: spacing.sm + 2,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  sourcesLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 4
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginTop: 3,
    borderWidth: 1,
    borderColor: colors.border
  },
  sourceText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 6,
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
    marginTop: 4
  },
  promptText: {
    ...typography.captionSemibold,
    color: colors.primary,
    fontSize: 12
  }
});
