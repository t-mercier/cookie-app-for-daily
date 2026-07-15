import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManageMembers } from "../ManageMembers";
import type { Member } from "../../types";

const members: Member[] = [{ id: "a", name: "Ann", avatarKey: "cat" }];

test("adds a member with trimmed name and chosen avatar", async () => {
  const onAdd = vi.fn();
  render(<ManageMembers members={members} onAdd={onAdd} onRemove={() => {}} />);
  await userEvent.type(screen.getByLabelText(/name/i), "  Bob  ");
  await userEvent.selectOptions(screen.getByLabelText(/avatar/i), "fox");
  await userEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(onAdd).toHaveBeenCalledWith("Bob", "fox");
});

test("does not add an empty name", async () => {
  const onAdd = vi.fn();
  render(<ManageMembers members={members} onAdd={onAdd} onRemove={() => {}} />);
  await userEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(onAdd).not.toHaveBeenCalled();
});

test("removes an existing member", async () => {
  const onRemove = vi.fn();
  render(<ManageMembers members={members} onAdd={() => {}} onRemove={onRemove} />);
  await userEvent.click(screen.getByRole("button", { name: /remove ann/i }));
  expect(onRemove).toHaveBeenCalledWith("a");
});

test("clears name input only after successful add", async () => {
  const onAdd = vi.fn(async () => {});
  render(<ManageMembers members={members} onAdd={onAdd} onRemove={() => {}} />);
  const input = screen.getByLabelText(/name/i);
  await userEvent.type(input, "Charlie");
  await userEvent.click(screen.getByRole("button", { name: /add/i }));
  await vi.waitFor(() => {
    expect(input).toHaveValue("");
  });
});

test("does not clear name input when add fails", async () => {
  const onAdd = vi.fn(async () => {
    throw new Error("Network error");
  });
  render(<ManageMembers members={members} onAdd={onAdd} onRemove={() => {}} />);
  const input = screen.getByLabelText(/name/i);
  await userEvent.type(input, "David");
  await userEvent.click(screen.getByRole("button", { name: /add/i }));
  await vi.waitFor(() => {
    expect(input).toHaveValue("David");
  });
  expect(screen.getByRole("alert")).toBeInTheDocument();
});

test("shows error when remove fails", async () => {
  const onRemove = vi.fn(async () => {
    throw new Error("Delete failed");
  });
  render(<ManageMembers members={members} onAdd={() => {}} onRemove={onRemove} />);
  await userEvent.click(screen.getByRole("button", { name: /remove ann/i }));
  await vi.waitFor(() => {
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Delete failed");
  });
});
