module.exports = {
	mode: 'jit',
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				discord: {
					600: '#3c45a5',
					blurple: {
						100: '#f7f7fe',
						130: '#f0f1fe',
						160: '#e7e9fd',
						200: '#dee0fc',
						230: '#d4d7fc',
						260: '#c9cdfb',
						300: '#bcc1fa',
						330: '#a8aff8',
						360: '#949cf7',
						400: '#7984f5',
						430: '#707bf4',
						460: '#6571f3',
						500: '#5865f2',
						530: '#505cdc',
						560: '#4752c4',
						600: '#3c45a5',
						630: '#343b8f',
						660: '#2d347d',
						700: '#232861',
						730: '#21265b',
						760: '#1e2353',
						800: '#1a1e49',
						830: '#141738',
						860: '#0d0f24',
						900: '#04050c',
					},
					red: {
						130: '#fdeeee',
						160: '#fce4e4',
						200: '#fbd9da',
						230: '#facecf',
						260: '#f9c2c3',
						300: '#f8b3b5',
						330: '#f69c9e',
						360: '#f38688',
						400: '#f1686a',
						430: '#f05d60',
						460: '#ee5154',
						500: '#ed4245',
						530: '#d83c3f',
						560: '#c03538',
						600: '#a12d2f',
						630: '#8c2729',
						660: '#7a2224',
						700: '#5f1a1c',
						730: '#59191a',
						760: '#521718',
						800: '#471415',
						830: '#370f10',
						860: '#240a0a',
						900: '#0c0303',
					},
					green: {
						100: '#f7fef9',
						130: '#f0fef4',
						160: '#e7fdee',
						200: '#ddfce7',
						230: '#d3fce0',
						260: '#c9fbd8',
						300: '#bcfacf',
						330: '#a7f8c0',
						360: '#93f7b2',
						400: '#79f59f',
						430: '#6ff498',
						460: '#64f391',
						500: '#57f287',
						530: '#4fdc7b',
						560: '#46c46d',
						600: '#3ba55c',
						630: '#338f50',
						660: '#2d7d46',
						700: '#236136',
						730: '#215b32',
						760: '#1e532e',
						800: '#1a4929',
						830: '#14381f',
						860: '#0d2414',
						900: '#040c07',
					},
				},
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'code::before': false,
						'code::after': false,
						code: {
							fontWeight: 400,
							backgroundColor: '#f2f3f5',
							padding: theme('spacing.1'),
							borderRadius: theme('borderRadius.md'),
						},
						pre: {
							color: theme('colors.gray.700'),
							backgroundColor: '#f2f3f5',
						},
						a: {
							textDecoration: 'none',
						},
					},
				},
				light: {
					css: [
						{
							color: theme('colors.gray.400'),
							'[class~="lead"]': {
								color: theme('colors.gray.300'),
							},
							a: {
								color: theme('colors.discord.blurple.330'),
							},
							strong: {
								color: theme('colors.white'),
							},
							'ol > li::before': {
								color: theme('colors.gray.400'),
							},
							'ul > li::before': {
								backgroundColor: theme('colors.gray.600'),
							},
							hr: {
								borderColor: theme('colors.gray.200'),
							},
							blockquote: {
								color: theme('colors.gray.200'),
								borderLeftColor: theme('colors.gray.600'),
							},
							h1: {
								color: theme('colors.white'),
							},
							h2: {
								color: theme('colors.white'),
							},
							h3: {
								color: theme('colors.white'),
							},
							h4: {
								color: theme('colors.white'),
							},
							'figure figcaption': {
								color: theme('colors.gray.400'),
							},
							'a code': {
								color: theme('colors.white'),
							},
							code: {
								color: theme('colors.gray.100'),
								backgroundColor: '#2f3136',
							},
							pre: {
								color: theme('colors.gray.200'),
								backgroundColor: '#2f3136',
							},
							thead: {
								color: theme('colors.white'),
								borderBottomColor: theme('colors.gray.400'),
							},
							'tbody tr': {
								borderBottomColor: theme('colors.gray.600'),
							},
						},
					],
				},
			}),
		},
	},
	variants: {
		extend: {},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
