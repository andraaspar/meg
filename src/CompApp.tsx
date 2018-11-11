import React, { Component } from 'react';

export interface CompAppProps { }
export interface CompAppState {
	questionNumber: number
	question: string
	correctAnswer: string
	answer: string
	isWrong: boolean
}
export interface CompAppSnapshot { }

export class CompApp extends Component<CompAppProps, CompAppState> {
	static displayName = __filename

	constructor(props: CompAppProps) {
		super(props)
		this.state = {
			question: '',
			answer: '',
			correctAnswer: '',
			isWrong: false,
			questionNumber: 0,
		}
	}
	// componentWillMount() {}
	// getDerivedStateFromProps(nextProps: CompAppProps, prevState: CompAppState): CompAppState | null {}
	// shouldComponentUpdate(nextProps: CompAppProps, nextState: CompAppState): boolean {}
	render() {
		return (
			<section className="section">
				<div className="container">
					<h1 className="title">
						{`Meg`}
					</h1>
					<p className="subtitle">
						{`${this.state.questionNumber}. kérdés`}
					</p>
					{!this.state.isWrong && this.state.questionNumber > 1 &&
						<article className="message is-success">
							<div className="message-body">
								{`Helyes válasz!`}
							</div>
						</article>
					}
					<form onSubmit={this.onSubmitted}>
						<div className="field">
							<label className="label">{this.state.question}</label>
							<div className="control">
								<input
									className={['input', this.state.isWrong && 'is-danger'].filter(Boolean).join(' ')}
									type="text"
									value={this.state.answer}
									onChange={this.onAnswerChanged}
								/>
							</div>
							{this.state.isWrong &&
								<p className="help is-danger">Hibás válasz</p>
							}
						</div>
						<div className="field is-grouped">
							<div className="control">
								<button
									className="button is-link"
								>
									{`Kész`}
								</button>
							</div>
						</div>
					</form>
				</div>
			</section>
		)
	}

	componentDidMount() {
		this.makeQuestion()
	}
	// getSnapshotBeforeUpdate(prevProps: CompAppProps, prevState: CompAppState): CompAppSnapshot {}
	// componentDidUpdate(prevProps: CompAppProps, prevState: CompAppState, snapshot: CompAppSnapshot) {}
	// componentWillUnmount() {}

	onAnswerChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			answer: e.currentTarget.value,
		})
	}

	onSubmitted = (e: React.FormEvent) => {
		e.preventDefault()
		const answer = this.state.answer.trim().replace(/^\+/, '')
		if (answer === this.state.correctAnswer) {
			this.makeQuestion()
		} else {
			this.setState({
				isWrong: true,
			})
		}
	}

	makeQuestion() {
		const componentCount = this.random(3, 5)
		let sum = 0
		let question = ''
		for (let i = 0; i < componentCount; i++) {
			let compValue = this.random(-99, 99, true)
			let compString = this.withSign(compValue)
			const nestCount = this.random(0, 2)
			for (let j = 0; j < nestCount; j++) {
				const isNegative = Math.random() < .5
				if (isNegative) {
					compValue = -compValue
					compString = `-(${compString})`
				} else {
					compString = `+(${compString})`
				}
			}
			const multi = Math.random() < .33 ? this.random(-3, 3) : 0
			if (multi) {
				compValue *= multi
				const before = Math.random() < .5
				if (before) {
					compString = `${this.withSign(multi)}·(${compString})`
				} else {
					compString = `${compString}·(${this.withSign(multi)})`
				}
			}
			question += compString
			sum += compValue
		}
		question += '='
		const correctAnswer = new Intl.NumberFormat('hu-HU').format(sum)
		this.setState(state => ({
			questionNumber: state.questionNumber + 1,
			answer: '',
			isWrong: false,
			question,
			correctAnswer,
		}))
	}

	random(min: number, max: number, frag?: boolean) {
		let r = min + Math.random() * (max + 1 - min)
		if (frag) {
			const p = 10 ** this.random(0, 3)
			r = Math.floor(r * p) / p
		} else {
			r = Math.floor(r)
		}
		return r
	}

	withSign(n: number) {
		return (n >= 0 ? '+' : '') + new Intl.NumberFormat('hu-HU').format(n)
	}
}
