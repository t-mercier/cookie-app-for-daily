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
    cookieCounts: { a: 5 },
    onAward: vi.fn(),
    onRemoveCookie: vi.fn(),
    onUpdateMember: vi.fn(),
    ...overrides,
  };
  render(<CharacterSelect {...props} />);
  return props;
}

test("renders nothing when closed", () => {
  const { container } = render(
    <CharacterSelect
      open={false}
      onClose={() => {}}
      members={members}
      onAdd={() => {}}
      onRemove={() => {}}
      cookieCounts={{}}
      onAward={() => {}}
      onRemoveCookie={() => {}}
      onUpdateMember={() => {}}
    />
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

test("adds a member with image url when url is provided", async () => {
  const onAdd = vi.fn();
  setup({ onAdd });
  const urlInput = screen.getByLabelText(/image url/i);
  const nameInput = screen.getByLabelText(/name/i);
  await userEvent.type(nameInput, "Charlie");
  await userEvent.type(urlInput, "https://example.com/avatar.png");
  await userEvent.click(screen.getByRole("button", { name: /start/i }));
  expect(onAdd).toHaveBeenCalledWith("Charlie", "https://example.com/avatar.png");
});

test("clicking + calls onAward with member id", async () => {
  const onAward = vi.fn();
  setup({ onAward });
  await userEvent.click(screen.getByRole("button", { name: /give cookie to ann/i }));
  expect(onAward).toHaveBeenCalledWith("a");
});

test("clicking - calls onRemoveCookie with member id", async () => {
  const onRemoveCookie = vi.fn();
  setup({ onRemoveCookie });
  await userEvent.click(screen.getByRole("button", { name: /remove cookie from ann/i }));
  expect(onRemoveCookie).toHaveBeenCalledWith("a");
});

test("editing member name and saving calls onUpdateMember", async () => {
  const onUpdateMember = vi.fn();
  setup({ onUpdateMember });
  await userEvent.click(screen.getByRole("button", { name: /edit/i }));
  const nameInput = screen.getByDisplayValue("Ann");
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, "Alice");
  await userEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(onUpdateMember).toHaveBeenCalledWith("a", { name: "Alice", avatarKey: "knight" });
});

test("editing with empty name does not call onUpdateMember", async () => {
  const onUpdateMember = vi.fn();
  setup({ onUpdateMember });
  await userEvent.click(screen.getByRole("button", { name: /edit/i }));
  const nameInput = screen.getByDisplayValue("Ann");
  await userEvent.clear(nameInput);
  await userEvent.click(screen.getByRole("button", { name: /save/i }));
  expect(onUpdateMember).not.toHaveBeenCalled();
});
