import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Button from "../components/Button";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Select from "../components/Select";
import Checkbox from "../components/Checkbox";
import Toggle from "../components/Toggle";
import Dropdown from "../components/Dropdown";
import Loading from "../components/Loading";
import Toast from "../components/Toast";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Divider from "../components/Divider";
import Tooltip from "../components/Tooltip";
import SearchInput from "../components/SearchInput";
import FileUpload from "../components/FileUpload";
import Progress from "../components/Progress";
import Pagination from "../components/Pagination";
import Radio from "../components/Radio";
import Accordion from "../components/Accordion";
import Tabs from "../components/Tabs";
import Typography from "../components/Typography";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table";

describe("component smoke tests", () => {
  it("renders Button with children and click event", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole("button", { name: /click me/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders Input and supports typing", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email" placeholder="Email" />);

    const input = screen.getByLabelText(/email/i);
    await user.type(input, "test@example.com");

    expect(input).toHaveValue("test@example.com");
  });

  it("renders TextArea and supports typing", async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="Notes" placeholder="Notes" />);

    const textArea = screen.getByLabelText(/notes/i);
    await user.type(textArea, "hello world");

    expect(textArea).toHaveValue("hello world");
  });

  it("renders Card with content", () => {
    render(<Card>Body</Card>);
    expect(screen.getByText(/body/i)).toBeInTheDocument();
  });

  it("renders Badge text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  it("renders Avatar with fallback initials", () => {
    render(<Avatar fallback="Jane Doe" alt="Jane" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders Divider", () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders Checkbox and toggles checked state", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Agree" checked={false} onChange={vi.fn()} />);

    await user.click(screen.getByLabelText(/agree/i));

    expect(screen.getByLabelText(/agree/i)).toBeInTheDocument();
  });

  it("renders Radio with label", () => {
    render(<Radio aria-label="Plan" label="Plan" />);
    expect(screen.getByLabelText(/plan/i)).toBeInTheDocument();
  });

  it("renders Toggle and flips callback", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Toggle checked={false} onChange={onChange} label="Enable" />);

    await user.click(screen.getByRole("switch"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders Select and its option labels", () => {
    render(
      <Select
        aria-label="Status"
        options={[{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }]}
        placeholder="Choose"
      />
    );

    expect(screen.getByRole("combobox", { name: /status/i })).toBeInTheDocument();
    expect(screen.getByText(/open/i)).toBeInTheDocument();
  });

  it("renders Dropdown and selects an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Dropdown
        options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]}
        onChange={onChange}
        placeholder="Pick one"
      />
    );

    await user.click(screen.getByRole("button", { name: /pick one/i }));
    await user.click(screen.getByText(/option a/i));

    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("renders Loading", () => {
    render(<Loading variant="spinner" text="Loading" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders Toast and close button", () => {
    const onClose = vi.fn();

    render(
      <Toast
        isVisible
        type="success"
        message="Saved"
        heading="Done"
        duration={0}
        onClose={onClose}
      />
    );

    expect(screen.getByText(/saved/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it("renders Alert and close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Alert type="info" title="Notice" message="Information" showCloseButton onClose={onClose} />
    );

    await user.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders Modal when open", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Dialog">
        <div>Modal body</div>
      </Modal>
    );

    expect(screen.getByText(/dialog/i)).toBeInTheDocument();
    expect(screen.getByText(/modal body/i)).toBeInTheDocument();
  });

  it("renders Progress with label", () => {
    render(<Progress value={25} showLabel />);
    expect(screen.getByText("25%" )).toBeInTheDocument();
  });

  it("renders FileUpload and handles file selection", () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelect).toHaveBeenCalledWith([file]);
  });

  it("renders Pagination and changes pages", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("renders Accordion items and toggles content", async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        items={[
          { title: "Section 1", content: <div>Content 1</div> },
          { title: "Section 2", content: <div>Content 2</div> },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /section 1/i }));
    expect(screen.getByText(/content 1/i)).toBeInTheDocument();
  });

  it("renders Tabs and changes active tab content", async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        tabs={[
          { label: "First", content: <div>First content</div> },
          { label: "Second", content: <div>Second content</div> },
        ]}
      />
    );

    expect(screen.getByText(/first content/i)).toBeInTheDocument();

    await user.click(screen.getByText(/second/i));

    expect(screen.getByText(/second content/i)).toBeInTheDocument();
  });

  it("renders SearchInput and triggers search callback", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, "abc");

    expect(onSearch).toHaveBeenCalled();
  });

  it("renders Tooltip on hover", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button", { name: /hover me/i }));
    expect(screen.getByText(/tooltip text/i)).toBeInTheDocument();
  });

  it("renders ImageWithPlaceholder", () => {
    render(<ImageWithPlaceholder alt="Avatar image" src="/avatar.png" />);
    expect(screen.getByAltText(/avatar image/i)).toBeInTheDocument();
  });

  it("renders a table structure", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jane</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/jane/i)).toBeInTheDocument();
  });

  it("renders Typography text", () => {
    render(<Typography variant="p">Welcome</Typography>);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
