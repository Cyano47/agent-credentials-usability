export function Suggested() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Suggested ceilings</h1>
          <p>
            The platform recommends limits from the last 12 coding-agent-prod runs. You can still
            type your own.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card" data-tour="suggested-defaults">
            <h3>Suggested for this task</h3>
            <table>
              <tbody>
                <tr>
                  <td>Spend</td>
                  <td>
                    <b>$18</b> <span className="small">suggested · cap $25</span>
                  </td>
                </tr>
                <tr>
                  <td>Actions</td>
                  <td>
                    <b>36</b> <span className="small">suggested · cap 40</span>
                  </td>
                </tr>
                <tr>
                  <td>Live resources</td>
                  <td>
                    <b>3</b>
                  </td>
                </tr>
                <tr>
                  <td>Inference tokens</td>
                  <td>
                    <b>280,000</b> <span className="small">includes reasoning tokens</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col">
          <div className="card" data-tour="utilization">
            <h3>Utilization by agent</h3>
            <p className="small">coding-agent-prod · last 7 days</p>
            <p>
              Median run used <b>61%</b> of its spend ceiling and <b>44%</b> of its action ceiling. 3
              of 48 runs hit a ceiling. Those three were retry loops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
