import type { ResultTier } from './scoring';

interface TierTheme {
    bgGradient: [string, string, string];
    accentColor: string;
    textColor: string;
    decorEmoji: string;
    borderColor: string;
}

const TIER_THEMES: Record<ResultTier, TierTheme> = {
    user_gulaam: {
        bgGradient: ['#1a0005', '#4a0011', '#7a001a'],
        accentColor: '#FF3B30',
        textColor: '#FFFFFF',
        decorEmoji: '🏆',
        borderColor: '#FF6B6B',
    },
    partner_gulaam: {
        bgGradient: ['#0a001a', '#1a0040', '#300070'],
        accentColor: '#8B5CF6',
        textColor: '#FFFFFF',
        decorEmoji: '👑',
        borderColor: '#A78BFA',
    },
    equal: {
        bgGradient: ['#1a0a00', '#3a1500', '#5a2500'],
        accentColor: '#F59E0B',
        textColor: '#FFFFFF',
        decorEmoji: '❤️',
        borderColor: '#FCD34D',
    },
    sigma: {
        bgGradient: ['#0a0a0a', '#1a1a2e', '#16213e'],
        accentColor: '#06B6D4',
        textColor: '#FFFFFF',
        decorEmoji: '😎',
        borderColor: '#22D3EE',
    },
    toxic: {
        bgGradient: ['#1a0800', '#4a1500', '#7a2500'],
        accentColor: '#F97316',
        textColor: '#FFFFFF',
        decorEmoji: '🔥',
        borderColor: '#FB923C',
    },
};

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

export async function generateShareImage(
    tier: ResultTier,
    title: string,
    description: string,
    userName: string,
    partnerName: string,
    format: 'square' | 'story' = 'square',
): Promise<string> {
    const width = 1080;
    const height = format === 'story' ? 1920 : 1080;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const theme = TIER_THEMES[tier];

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, theme.bgGradient[0]);
    gradient.addColorStop(0.5, theme.bgGradient[1]);
    gradient.addColorStop(1, theme.bgGradient[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative pattern — scattered emojis
    ctx.font = '48px serif';
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillText(theme.decorEmoji, x, y);
    }
    ctx.globalAlpha = 1;

    // Center content area
    const centerY = height / 2;
    const contentStartY = format === 'story' ? centerY - 300 : centerY - 220;

    // Accent glow
    const glowGradient = ctx.createRadialGradient(
        width / 2, contentStartY + 100, 50,
        width / 2, contentStartY + 100, 400,
    );
    glowGradient.addColorStop(0, theme.accentColor + '30');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);

    // Main card background
    const cardX = 60;
    const cardY = contentStartY - 40;
    const cardW = width - 120;
    const cardH = format === 'story' ? 680 : 540;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 32);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    ctx.strokeStyle = theme.borderColor + '40';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Big emoji at top
    ctx.font = '120px serif';
    ctx.textAlign = 'center';
    ctx.fillText(theme.decorEmoji, width / 2, contentStartY + 80);

    // Title
    ctx.font = 'bold 56px "Clash Display", "Inter", sans-serif';
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = 'center';

    // Word-wrap title
    const titleWords = title.replace(/[🏆😂🥰😎🔥👑]/g, '').trim().split(' ');
    let titleLine = '';
    const titleLines: string[] = [];
    const maxTitleWidth = width - 160;
    for (const word of titleWords) {
        const test = titleLine + (titleLine ? ' ' : '') + word;
        if (ctx.measureText(test).width > maxTitleWidth && titleLine) {
            titleLines.push(titleLine);
            titleLine = word;
        } else {
            titleLine = test;
        }
    }
    if (titleLine) titleLines.push(titleLine);

    let titleY = contentStartY + 150;
    for (const line of titleLines) {
        ctx.fillText(line, width / 2, titleY);
        titleY += 66;
    }

    // Names
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillStyle = theme.accentColor;
    const namesText = `${userName} & ${partnerName}`;
    ctx.fillText(namesText, width / 2, titleY + 30);

    // Description
    ctx.font = '28px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const descWords = description.split(' ');
    let descLine = '';
    const descLines: string[] = [];
    const maxDescWidth = width - 200;
    for (const word of descWords) {
        const test = descLine + (descLine ? ' ' : '') + word;
        if (ctx.measureText(test).width > maxDescWidth && descLine) {
            descLines.push(descLine);
            descLine = word;
        } else {
            descLine = test;
        }
    }
    if (descLine) descLines.push(descLine);

    let descY = titleY + 90;
    for (const line of descLines) {
        ctx.fillText(line, width / 2, descY);
        descY += 38;
    }

    // Watermark
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('jorukagulaam.com', width / 2, height - 50);

    // Decorative border line at bottom
    ctx.strokeStyle = theme.accentColor + '60';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height - 80);
    ctx.lineTo(width * 0.8, height - 80);
    ctx.stroke();

    return canvas.toDataURL('image/png');
}
