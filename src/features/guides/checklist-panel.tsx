import { submitChecklistToggleAction } from "./actions";
import type { ChecklistDisplayItem } from "./checklist";

type ChecklistPanelProps = {
  checklistItems: ChecklistDisplayItem[];
};

export function ChecklistPanel({ checklistItems }: ChecklistPanelProps) {
  const completedCount = checklistItems.filter((item) => item.completed).length;

  return (
    <section className="checklist-panel" aria-labelledby="checklist-heading" id="checklist">
      <div>
        <p className="eyebrow">New Student Checklist</p>
        <h2 id="checklist-heading">先完成这 6 件小事</h2>
        <p>
          {completedCount} / {checklistItems.length} completed. 登录后点击圆圈可以保存进度；
          没登录也可以先把它当作适应学校生活的路线图。
        </p>
      </div>
      <ul>
        {checklistItems.map((item) => (
          <li key={item.id}>
            <form action={submitChecklistToggleAction}>
              <input name="itemId" type="hidden" value={item.id} />
              <input name="completed" type="hidden" value={String(!item.completed)} />
              <button
                aria-label={`${item.completed ? "Mark incomplete" : "Mark complete"}: ${item.label.en}`}
                className="check-circle-button"
                data-completed={item.completed}
                type="submit"
              />
            </form>
            <span>{item.label.zh}</span>
            <small>{item.label.en}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
