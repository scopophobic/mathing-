import { saveOnboarding } from "@/app/actions";

export default function OnboardingPage() {
  return <div className="page-stack narrow"><header className="page-heading"><p className="plain-label">Set your starting line</p><h1>How should the first week feel?</h1><p>This changes the size of the prerequisite bridges, not what you are allowed to learn.</p></header><form action={saveOnboarding} className="onboarding-form">
    <fieldset><legend>Choose a starting level</legend><label><input type="radio" name="level" value="foundations" defaultChecked /><span><strong>Start from foundations</strong>Build fluency without assuming old knowledge.</span></label><label><input type="radio" name="level" value="refresher" /><span><strong>Refresh what I once learned</strong>Test first, then revisit only weak pieces.</span></label><label><input type="radio" name="level" value="core" /><span><strong>Begin with core topics</strong>Move directly into probability, algebra, and calculus.</span></label></fieldset>
    <fieldset><legend>Usual study time</legend><div className="radio-row">{[15,30,45,60].map((minutes) => <label key={minutes}><input type="radio" name="minutes" value={minutes} defaultChecked={minutes === 30} /><span>{minutes} min</span></label>)}</div></fieldset><input type="hidden" name="timezone" value="Asia/Kolkata" /><button className="primary-button" type="submit">Continue to the diagnostic</button>
  </form></div>;
}
