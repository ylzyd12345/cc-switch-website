import anthropicIcon from '@/assets/icons/anthropic.svg';
import cubenceIcon from '@/assets/icons/cubence.svg';
import geminiIcon from '@/assets/icons/gemini-2.svg';
import openaiIcon from '@/assets/icons/openai.svg';
import openRouterIcon from '@/assets/icons/openrouter.svg';
import packyCodeIcon from '@/assets/icons/packycode.svg';

export interface Provider {
  icon: string;
  iconBg: string;
  name: string;
  subtitle: string;
  time?: string;
  used?: string;
  remaining?: string;
  isUrl?: boolean;
  isText?: boolean;
  isSvgUrl?: boolean;
}

export const claudeProviders: Provider[] = [
  {
    icon: packyCodeIcon,
    iconBg: 'bg-emerald-500/20',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.com',
    time: '10',
    used: '672',
    remaining: '66',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: cubenceIcon,
    iconBg: 'bg-slate-500/20',
    name: 'Cubence',
    subtitle: 'https://cubence.com',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: anthropicIcon,
    iconBg: 'bg-blue-500/20',
    name: 'Anthropic',
    subtitle: 'Claude Opus 4.5',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconBg: 'bg-orange-500/20',
    name: 'OpenRouter',
    subtitle: 'Claude Sonnet 4.5',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const codexProviders: Provider[] = [
  {
    icon: packyCodeIcon,
    iconBg: 'bg-emerald-500/20',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.com',
    time: '5',
    used: '128',
    remaining: '372',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: cubenceIcon,
    iconBg: 'bg-slate-500/20',
    name: 'Cubence',
    subtitle: 'https://cubence.com',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconBg: 'bg-orange-500/20',
    name: 'OpenRouter',
    subtitle: 'GPT-5.1-Codex-Max',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openaiIcon,
    iconBg: 'bg-slate-500/20',
    name: 'OpenAI',
    subtitle: 'GPT-5.2',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const geminiProviders: Provider[] = [
  {
    icon: packyCodeIcon,
    iconBg: 'bg-emerald-500/20',
    name: 'PackyCode',
    subtitle: 'https://www.packyapi.com',
    time: '2',
    used: '256',
    remaining: '744',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: cubenceIcon,
    iconBg: 'bg-slate-500/20',
    name: 'Cubence',
    subtitle: 'https://cubence.com',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: geminiIcon,
    iconBg: 'bg-blue-500/20',
    name: 'Google AI',
    subtitle: 'Gemini 3 Flash Preview',
    isUrl: true,
    isSvgUrl: true,
  },
  {
    icon: openRouterIcon,
    iconBg: 'bg-orange-500/20',
    name: 'OpenRouter',
    subtitle: 'Gemini 3 Pro Preview',
    isUrl: true,
    isSvgUrl: true,
  },
];

export const defaultProviders = claudeProviders;
