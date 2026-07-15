import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterSelect } from "../CharacterSelect";
import type { Member } from "../../types";

const members: Member[] = [{ id: "a", name: "Ann", avatarKey: "knight" }];

function setup(overrides = {}) {
  const props = {
    open: true,
    onClose: vi.fn(),
    members,
    onAdd: vi.fn(),
    onRemove: vi.fn(),
    ...overrides,
  };
  render(<CharacterSelect {...props} />);
  return props;
}

test("renders nothing when closed", () => {
  const { container } = render(
    <CharacterSelect open={false} onClose={() => {}} members={members} onAdd={() => {}} onRemove={() => {}} />
  );
  expect(container).toBeEmptyDOMElement();
});

test("adds a member with picked sprite and trimmed name", async () => {
  const onAdd = vi.fn();
  setup({ onAdd });
  await userEvent.click(screen.getByTestId("pick-robot"));
  await userEvent.type(screen.getByLabelText(/name/i), "  Bob  ");
  await userEvent.click(screen.getByRole("button", { name: /start/i }));
  expect(onAdd).toHaveBeenCalledWith("Bob", "robot");
});

test("does not add on empty name", async () => {
  const onAdd = vi.fn();
  setup({ onAdd });
  await userEvent.click(screen.getByRole("button", { name: /start/i }));
  expect(onAdd).not.toHaveBeenCalled();
});

test("keeps input and shows error when add fails", async () => {
  const onAdd = vi.fn().mockRejectedValue(new Error("network"));
  setup({ onAdd });
  await userEvent.click(screen.getByTestId("pick-robot"));
  const input = screen.getByLabelText(/name/i);
  await userEvent.type(input, "Bob");
  await userEvent.click(screen.getByRole("button", { name: /start/i }));
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(input).toHaveValue("Bob");
});

test("removes an existing member", async () => {
  const onRemove = vi.fn();
  setup({ onRemove });
  await userEvent.click(screen.getByRole("button", { name: /remove ann/i }));
  expect(onRemove).toHaveBeenCalledWith("a");
});
