import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  FileUpload,
  ImageWithPlaceholder,
  Input,
  Loading,
  Skeleton,
  Modal,
  Pagination,
  Progress,
  Radio,
  SearchInput,
  Select,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TextArea,
  Toast,
  Toggle,
  Tooltip,
  Typography,
} from 'ssovee-os-web-ui'
import './App.css'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'ssovee-demo-theme'

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

type ComponentItem = {
  id: string
  name: string
}

const COMPONENT_LIST: ComponentItem[] = [
  { id: 'button', name: 'Button' },
  { id: 'input', name: 'Input' },
  { id: 'textarea', name: 'TextArea' },
  { id: 'select', name: 'Select' },
  { id: 'checkbox', name: 'Checkbox' },
  { id: 'toggle', name: 'Toggle' },
  { id: 'dropdown', name: 'Dropdown' },
  { id: 'loading', name: 'Loading' },
  { id: 'skeleton', name: 'Skeleton' },
  { id: 'toast', name: 'Toast' },
  { id: 'alert', name: 'Alert' },
  { id: 'modal', name: 'Modal' },
  { id: 'card', name: 'Card' },
  { id: 'badge', name: 'Badge' },
  { id: 'avatar', name: 'Avatar' },
  { id: 'divider', name: 'Divider' },
  { id: 'tooltip', name: 'Tooltip' },
  { id: 'search-input', name: 'SearchInput' },
  { id: 'file-upload', name: 'FileUpload' },
  { id: 'progress', name: 'Progress' },
  { id: 'pagination', name: 'Pagination' },
  { id: 'radio', name: 'Radio' },
  { id: 'accordion', name: 'Accordion' },
  { id: 'tabs', name: 'Tabs' },
  { id: 'typography', name: 'Typography' },
  { id: 'image', name: 'ImageWithPlaceholder' },
  { id: 'table', name: 'Table' },
]

type DemoVariant = {
  label: string
  code: string
  preview: ReactNode
}

type PropRow = {
  prop: string
  type: string
  defaultValue: string
  description: string
}

const PROP_MATRIX: Record<string, PropRow[]> = {
  Button: [
    { prop: 'variant', type: 'primary | secondary | outline | ghost | danger | success | filled | text', defaultValue: 'primary', description: 'Visual style.' },
    { prop: 'tone', type: 'primary | neutral | success | danger', defaultValue: 'primary', description: 'Used by filled/text variants.' },
    { prop: 'size', type: 'sm | md | lg | xl', defaultValue: 'md', description: 'Height and padding scale.' },
    { prop: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows spinner and disables button.' },
    { prop: 'leftIcon/rightIcon', type: 'ReactNode', defaultValue: 'undefined', description: 'Inline icon slots.' },
  ],
  Input: [
    { prop: 'variant', type: 'default | filled | outline', defaultValue: 'default', description: 'Input appearance.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Field density.' },
    { prop: 'label/helperText/error', type: 'string', defaultValue: 'undefined', description: 'Form messaging.' },
    { prop: 'showSubmitButton/onSubmit', type: 'boolean / () => void', defaultValue: 'false / undefined', description: 'Inline submit action.' },
    { prop: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Stretch to container width.' },
  ],
  TextArea: [
    { prop: 'variant', type: 'default | filled | outline', defaultValue: 'default', description: 'Textarea appearance.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Padding and font scale.' },
    { prop: 'resize', type: 'none | vertical | horizontal | both', defaultValue: 'vertical', description: 'Resize behavior.' },
    { prop: 'label/helperText/error', type: 'string', defaultValue: 'undefined', description: 'Form metadata.' },
    { prop: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Expands to container width.' },
  ],
  Select: [
    { prop: 'options', type: 'SelectOption[]', defaultValue: 'required', description: 'Option list.' },
    { prop: 'variant', type: 'default | filled | outline', defaultValue: 'default', description: 'Select style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Control size.' },
    { prop: 'placeholder', type: 'string', defaultValue: 'undefined', description: 'Disabled first option label.' },
    { prop: 'onChange', type: '(value: string) => void', defaultValue: 'undefined', description: 'Value callback.' },
  ],
  Checkbox: [
    { prop: 'variant', type: 'default | filled', defaultValue: 'default', description: 'Checkbox visual style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Control dimensions.' },
    { prop: 'checked/onChange', type: 'boolean / event handler', defaultValue: 'uncontrolled if omitted', description: 'Selection state.' },
    { prop: 'indeterminate', type: 'boolean', defaultValue: 'false', description: 'Mixed state indicator.' },
    { prop: 'label/helperText/error', type: 'ReactNode/string', defaultValue: 'undefined', description: 'Context and validation text.' },
  ],
  Toggle: [
    { prop: 'checked', type: 'boolean', defaultValue: 'required', description: 'Current toggle state.' },
    { prop: 'onChange', type: '(checked: boolean) => void', defaultValue: 'required', description: 'State change callback.' },
    { prop: 'variant', type: 'default | success | warning | danger', defaultValue: 'default', description: 'Active color style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Switch dimensions.' },
    { prop: 'label/helperText/fullWidth', type: 'string/boolean', defaultValue: 'undefined/false', description: 'Extra layout and copy.' },
  ],
  Dropdown: [
    { prop: 'options', type: 'DropdownOption[]', defaultValue: 'required', description: 'Menu options with optional icons.' },
    { prop: 'variant', type: 'default | filled | outline', defaultValue: 'default', description: 'Trigger appearance.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Trigger density.' },
    { prop: 'trigger', type: 'ReactNode', defaultValue: 'undefined', description: 'Custom trigger renderer.' },
    { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevents opening and selection.' },
  ],
  Loading: [
    { prop: 'variant', type: 'spinner | dots | pulse | image', defaultValue: 'image', description: 'Loader visual type.' },
    { prop: 'size', type: 'sm | md | lg | xl', defaultValue: 'md', description: 'Loader scale.' },
    { prop: 'text', type: 'string', defaultValue: 'Loading...', description: 'Status label below loader.' },
    { prop: 'fullScreen', type: 'boolean', defaultValue: 'false', description: 'Shows centered overlay loader.' },
    { prop: 'className', type: 'string', defaultValue: 'undefined', description: 'Custom wrapper classes.' },
  ],
  Skeleton: [
    { prop: 'variant', type: 'text | avatar | image | card | rect', defaultValue: 'text', description: 'Preset skeleton pattern.' },
    { prop: 'lines', type: 'number', defaultValue: '3', description: 'Number of lines for text/card variants.' },
    { prop: 'animate', type: 'boolean', defaultValue: 'true', description: 'Enables pulse animation.' },
    { prop: 'lineClassName', type: 'string', defaultValue: 'undefined', description: 'Custom classes for text/card lines.' },
    { prop: 'className', type: 'string', defaultValue: 'undefined', description: 'Custom wrapper classes.' },
  ],
  Toast: [
    { prop: 'type', type: 'error | success | info | warning', defaultValue: 'required', description: 'Toast status style.' },
    { prop: 'position', type: 'top-left | top-right | bottom-left | bottom-right | top-center | bottom-center', defaultValue: 'bottom-left', description: 'Viewport position.' },
    { prop: 'duration', type: 'number', defaultValue: '5000', description: 'Auto close ms (except error type).' },
    { prop: 'showCloseButton', type: 'boolean', defaultValue: 'true', description: 'Manual close control.' },
    { prop: 'isVisible/onClose', type: 'boolean / () => void', defaultValue: 'required', description: 'Visibility contract.' },
  ],
  Alert: [
    { prop: 'type', type: 'success | error | warning | info', defaultValue: 'required', description: 'Semantic tone.' },
    { prop: 'variant', type: 'default | filled | outline', defaultValue: 'default', description: 'Surface style.' },
    { prop: 'title/message', type: 'string', defaultValue: 'undefined', description: 'Main content text.' },
    { prop: 'showCloseButton/onClose', type: 'boolean / () => void', defaultValue: 'false / undefined', description: 'Dismiss control.' },
    { prop: 'children', type: 'ReactNode', defaultValue: 'undefined', description: 'Custom body content.' },
  ],
  Modal: [
    { prop: 'isOpen', type: 'boolean', defaultValue: 'required', description: 'Open state flag.' },
    { prop: 'size', type: 'sm | md | lg | xl | full', defaultValue: 'md', description: 'Dialog max width.' },
    { prop: 'showCloseButton', type: 'boolean', defaultValue: 'true', description: 'Header close button visibility.' },
    { prop: 'closeOnOverlayClick', type: 'boolean', defaultValue: 'true', description: 'Allows outside click dismissal.' },
    { prop: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Allows Escape key dismissal.' },
  ],
  Card: [
    { prop: 'variant', type: 'default | elevated | outlined | filled', defaultValue: 'default', description: 'Card treatment.' },
    { prop: 'padding', type: 'none | sm | md | lg', defaultValue: 'md', description: 'Internal spacing preset.' },
    { prop: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Card content body.' },
    { prop: 'className', type: 'string', defaultValue: 'undefined', description: 'Custom style classes.' },
  ],
  Badge: [
    { prop: 'variant', type: 'default | primary | success | warning | danger | info', defaultValue: 'default', description: 'Badge semantic style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Badge scale.' },
    { prop: 'rounded', type: 'sm | md | lg | full', defaultValue: 'md', description: 'Corner radius option.' },
    { prop: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Badge text/content.' },
  ],
  Avatar: [
    { prop: 'src', type: 'string', defaultValue: 'undefined', description: 'Image source URL.' },
    { prop: 'fallback', type: 'string', defaultValue: 'undefined', description: 'Initials source when image unavailable.' },
    { prop: 'size', type: 'sm | md | lg | xl', defaultValue: 'md', description: 'Avatar dimensions.' },
    { prop: 'alt', type: 'string', defaultValue: 'Avatar', description: 'Image alt label.' },
    { prop: 'onClick', type: '() => void', defaultValue: 'undefined', description: 'Optional click behavior.' },
  ],
  Divider: [
    { prop: 'orientation', type: 'horizontal | vertical', defaultValue: 'horizontal', description: 'Axis direction.' },
    { prop: 'variant', type: 'solid | dashed | dotted', defaultValue: 'solid', description: 'Line style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Thickness preset.' },
    { prop: 'className', type: 'string', defaultValue: 'undefined', description: 'Custom classes.' },
  ],
  Tooltip: [
    { prop: 'content', type: 'string', defaultValue: 'required', description: 'Tooltip text content.' },
    { prop: 'position', type: 'top | bottom | left | right', defaultValue: 'top', description: 'Tooltip location.' },
    { prop: 'delay', type: 'number', defaultValue: '200', description: 'Show delay in ms.' },
    { prop: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Trigger element.' },
    { prop: 'className', type: 'string', defaultValue: 'undefined', description: 'Tooltip class override.' },
  ],
  SearchInput: [
    { prop: 'variant', type: 'default | filled | outline', defaultValue: 'default', description: 'Input style variant.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Input size preset.' },
    { prop: 'showClearButton', type: 'boolean', defaultValue: 'true', description: 'Shows clear action icon.' },
    { prop: 'enableKeyboardShortcuts', type: 'boolean', defaultValue: 'false', description: 'Adds shortcut helpers.' },
    { prop: 'onSearch', type: '(value: string) => void', defaultValue: 'undefined', description: 'Value callback.' },
  ],
  FileUpload: [
    { prop: 'variant', type: 'default | filled | outline', defaultValue: 'default', description: 'Drop zone style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Drop zone height.' },
    { prop: 'accept/multiple', type: 'string / boolean', defaultValue: 'undefined / false', description: 'File type and multi-select control.' },
    { prop: 'maxSize', type: 'number', defaultValue: 'undefined', description: 'Max file bytes filter.' },
    { prop: 'dragAndDrop/disabled', type: 'boolean', defaultValue: 'false', description: 'DnD and disabled behavior.' },
  ],
  Progress: [
    { prop: 'value', type: 'number', defaultValue: 'required', description: 'Current progress value.' },
    { prop: 'max', type: 'number', defaultValue: '100', description: 'Maximum value used for percentage.' },
    { prop: 'variant', type: 'default | success | warning | danger', defaultValue: 'default', description: 'Bar color style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Track thickness.' },
    { prop: 'showLabel/animated', type: 'boolean', defaultValue: 'false', description: 'Label visibility and pulse animation.' },
  ],
  Pagination: [
    { prop: 'currentPage/totalPages', type: 'number', defaultValue: 'required', description: 'Pagination state values.' },
    { prop: 'variant', type: 'default | outline', defaultValue: 'default', description: 'Button style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Control size.' },
    { prop: 'showFirstLast/showPrevNext', type: 'boolean', defaultValue: 'true', description: 'Navigation button toggles.' },
    { prop: 'maxVisiblePages', type: 'number', defaultValue: '5', description: 'Visible page count before ellipsis.' },
  ],
  Radio: [
    { prop: 'variant', type: 'default | filled', defaultValue: 'default', description: 'Radio control style.' },
    { prop: 'size', type: 'sm | md | lg', defaultValue: 'md', description: 'Control dimensions.' },
    { prop: 'label', type: 'string', defaultValue: 'undefined', description: 'Radio label text.' },
    { prop: 'helperText/error', type: 'string', defaultValue: 'undefined', description: 'Message under radio.' },
    { prop: 'checked/disabled', type: 'boolean', defaultValue: 'uncontrolled / false', description: 'Selection and disabled state.' },
  ],
  Accordion: [
    { prop: 'items', type: '{ title: string; content: ReactNode }[]', defaultValue: 'required', description: 'Accordion panels.' },
    { prop: 'active', type: 'number', defaultValue: '-1', description: 'Default open item index.' },
  ],
  Tabs: [
    { prop: 'tabs', type: '{ label: string; content: ReactNode; icon?: ReactNode }[]', defaultValue: 'required', description: 'Tab list.' },
    { prop: 'defaultActiveTab', type: 'number', defaultValue: '0', description: 'Initial active index.' },
    { prop: 'onTabChange', type: '(index: number) => void', defaultValue: 'undefined', description: 'Selection callback.' },
    { prop: 'containerClassName/buttonClassName/activeButtonClassName', type: 'string', defaultValue: 'library defaults', description: 'Style overrides.' },
  ],
  Typography: [
    { prop: 'variant/as', type: 'h1|h2|h3|h4|h5|h6|p|span|div', defaultValue: 'p / variant', description: 'Semantic and render tag.' },
    { prop: 'size', type: 'xs|sm|md|lg|xl|2xl|3xl|4xl|5xl', defaultValue: 'undefined', description: 'Type scale token.' },
    { prop: 'weight', type: 'thin|extralight|light|normal|medium|semibold|bold|extrabold|black', defaultValue: 'undefined', description: 'Font weight token.' },
    { prop: 'color', type: 'neutral-100..900 | brand-color | red-500 | green-500 | blue-500 | yellow-500', defaultValue: 'undefined', description: 'Text color token.' },
  ],
  ImageWithPlaceholder: [
    { prop: 'src', type: 'string | { src: string }', defaultValue: 'undefined', description: 'Primary image source.' },
    { prop: 'fallbackSrc', type: 'string', defaultValue: '""', description: 'Used when src fails or is invalid.' },
    { prop: 'alt', type: 'string', defaultValue: 'undefined', description: 'Accessible alt text.' },
    { prop: 'className', type: 'string', defaultValue: 'undefined', description: 'Image style overrides.' },
  ],
  Table: [
    { prop: 'Table + primitives', type: 'TableHeader/TableBody/TableFooter/TableRow/TableHead/TableCell/TableCaption', defaultValue: 'composable', description: 'Composable table building blocks.' },
    { prop: 'TableRow onClick', type: '(event) => void', defaultValue: 'undefined', description: 'Makes rows interactive.' },
    { prop: 'className', type: 'string', defaultValue: 'undefined', description: 'Styling overrides at each primitive.' },
  ],
}

function DemoShowcase({ title, description, variants }: { title: string; description: string; variants: DemoVariant[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = variants[activeIndex]
  const propRows = PROP_MATRIX[title] ?? []

  return (
    <article className="demo-showcase">
      <div className="demo-header">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="demo-shell">
        <div className="demo-tabs" role="tablist" aria-label={`${title} variants`}>
          {variants.map((variant, index) => (
            <button
              key={variant.label}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={`demo-tab ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {variant.label}
            </button>
          ))}
        </div>

        <div className="demo-preview">{active.preview}</div>

        <pre className="demo-code">
          <code>{active.code}</code>
        </pre>

        {propRows.length > 0 && (
          <div className="props-matrix-wrap">
            <div className="props-matrix-title">Props Matrix</div>
            <div className="props-matrix-scroll">
              <table className="props-matrix-table">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {propRows.map((row) => (
                    <tr key={`${title}-${row.prop}`}>
                      <td>{row.prop}</td>
                      <td>{row.type}</td>
                      <td>{row.defaultValue}</td>
                      <td>{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function App() {
  const [componentFilter, setComponentFilter] = useState('')
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.location.hash.slice(1) || ''
  })
  const [name, setName] = useState('Shivam')
  const [description, setDescription] = useState('A reusable design system component library.')
  const [selectValue, setSelectValue] = useState('react')
  const [dropdownValue, setDropdownValue] = useState('weekly')
  const [checked, setChecked] = useState(true)
  const [toggleValue, setToggleValue] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(3)
  const [progressValue, setProgressValue] = useState(64)
  const [plan, setPlan] = useState('basic')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success')
  const [toastPosition, setToastPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'>('bottom-right')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')
  const [files, setFiles] = useState<string[]>([])
  const [avatarClicks, setAvatarClicks] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFullscreenLoading, setShowFullscreenLoading] = useState(false)

  useEffect(() => {
    const updateTitle = () => {
      const section = activeSection ? `${activeSection.charAt(0).toUpperCase()}${activeSection.slice(1)}` : 'All Components'
      document.title = `${section} · SSOVEE OS Web UI`
    }

    updateTitle()
  }, [activeSection])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash.slice(1))
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const filteredComponents = useMemo(() => {
    const q = componentFilter.trim().toLowerCase()
    if (!q) {
      return COMPONENT_LIST
    }
    return COMPONENT_LIST.filter((item) => item.name.toLowerCase().includes(q))
  }, [componentFilter])

  const frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid', disabled: true },
  ]

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div>
            <h1>SSOVEE UI</h1>
            <p>Variants, all props, live demos, and code snippets.</p>
          </div>
          <button
            type="button"
            className="theme-toggle"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>

        <input
          className="filter-input"
          placeholder="Filter components"
          value={componentFilter}
          onChange={(event) => setComponentFilter(event.currentTarget.value)}
        />

        <nav className="toc">
          {filteredComponents.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="hero">
          <div>
            <h1>All Components</h1>
            <p>Each section now includes broader prop coverage and all valid variants for the component.</p>
          </div>
          <div className="hero-badge">{theme === 'dark' ? 'Dark preview' : 'Light preview'}</div>
        </header>

        <section id="button" className="docs-section">
          <DemoShowcase
            title="Button"
            description="All button variants plus size, loading, tone, icon, rounded, fullWidth, and disabled states."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="inline-stack">
                    <Button variant="primary">primary</Button>
                    <Button variant="secondary">secondary</Button>
                    <Button variant="outline">outline</Button>
                    <Button variant="ghost">ghost</Button>
                    <Button variant="danger">danger</Button>
                    <Button variant="success">success</Button>
                    <Button variant="filled" tone="neutral">filled neutral</Button>
                    <Button variant="text" tone="primary">text primary</Button>
                  </div>
                ),
                code: '<Button variant="primary|secondary|outline|ghost|danger|success|filled|text" tone="primary|neutral|success|danger" />',
              },
              {
                label: 'SIZES/ROUNDED',
                preview: (
                  <div className="inline-stack">
                    <Button size="sm" rounded="sm">sm</Button>
                    <Button size="md" rounded="md">md</Button>
                    <Button size="lg" rounded="lg">lg</Button>
                    <Button size="xl" rounded="full">xl full</Button>
                  </div>
                ),
                code: '<Button size="sm|md|lg|xl" rounded="sm|md|lg|full" />',
              },
              {
                label: 'LOADING/ICONS',
                preview: (
                  <div className="inline-stack">
                    <Button loading>Saving</Button>
                    <Button leftIcon={<span>L</span>} rightIcon={<span>R</span>}>With icons</Button>
                    <Button fullWidth className="full-demo-button">Full width</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                ),
                code: '<Button loading leftIcon={<span>L</span>} rightIcon={<span>R</span>} fullWidth disabled />',
              },
            ]}
          />
        </section>

        <section id="input" className="docs-section">
          <DemoShowcase
            title="Input"
            description="Variant, size, icon, submit button, helper/error text, label, and fullWidth."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="preview-col full-row">
                    <Input variant="default" placeholder="Default input" />
                    <Input variant="filled" placeholder="Filled input" />
                    <Input variant="outline" placeholder="Outline input" />
                  </div>
                ),
                code: '<Input variant="default|filled|outline" />',
              },
              {
                label: 'SIZES + ICONS',
                preview: (
                  <div className="preview-col full-row">
                    <Input size="sm" variant="outline" leftIcon={<span className="demo-inline-icon">S</span>} placeholder="Small" />
                    <Input size="md" variant="outline" leftIcon={<span className="demo-inline-icon">M</span>} rightIcon={<span className="demo-inline-icon">!</span>} placeholder="Medium" />
                    <Input size="lg" variant="outline" showSubmitButton onSubmit={() => setSearchValue(name)} placeholder="Large submit" />
                  </div>
                ),
                code: '<Input size="sm|md|lg" leftIcon={...} rightIcon={...} showSubmitButton onSubmit={...} />',
              },
              {
                label: 'FORM STATE',
                preview: (
                  <Input
                    label="Name"
                    value={name}
                    onChange={(event) => setName(event.currentTarget.value)}
                    helperText="Helper text shown when no error"
                    error={name.length < 3 ? 'Name must be at least 3 chars' : undefined}
                    fullWidth
                  />
                ),
                code: '<Input label="Name" value={value} onChange={...} helperText="..." error="..." fullWidth />',
              },
            ]}
          />
        </section>

        <section id="textarea" className="docs-section">
          <DemoShowcase
            title="TextArea"
            description="Covers all variants, sizes, resize modes, helper/error, label, and fullWidth."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="preview-col full-row">
                    <TextArea variant="default" rows={3} placeholder="Default" fullWidth />
                    <TextArea variant="filled" rows={3} placeholder="Filled" fullWidth />
                    <TextArea variant="outline" rows={3} placeholder="Outline" fullWidth />
                  </div>
                ),
                code: '<TextArea variant="default|filled|outline" rows={3} fullWidth />',
              },
              {
                label: 'SIZE + RESIZE',
                preview: (
                  <div className="preview-col full-row">
                    <TextArea size="sm" resize="none" rows={2} placeholder="size sm / resize none" fullWidth />
                    <TextArea size="md" resize="vertical" rows={3} placeholder="size md / resize vertical" fullWidth />
                    <TextArea size="lg" resize="both" rows={4} placeholder="size lg / resize both" fullWidth />
                  </div>
                ),
                code: '<TextArea size="sm|md|lg" resize="none|vertical|horizontal|both" />',
              },
              {
                label: 'FORM STATE',
                preview: (
                  <TextArea
                    label="Description"
                    value={description}
                    onChange={(event) => setDescription(event.currentTarget.value)}
                    error={description.length < 10 ? 'Please write at least 10 characters' : undefined}
                    helperText="Describe the purpose"
                    rows={4}
                    fullWidth
                  />
                ),
                code: '<TextArea label="Description" value={value} onChange={...} error="..." helperText="..." fullWidth />',
              },
            ]}
          />
        </section>

        <section id="select" className="docs-section">
          <DemoShowcase
            title="Select"
            description="All variants/sizes plus placeholder, helper/error, label, disabled option, and fullWidth."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="preview-col full-row">
                    <Select variant="default" options={frameworkOptions} value={selectValue} onChange={setSelectValue} />
                    <Select variant="filled" options={frameworkOptions} value={selectValue} onChange={setSelectValue} />
                    <Select variant="outline" options={frameworkOptions} value={selectValue} onChange={setSelectValue} />
                  </div>
                ),
                code: '<Select variant="default|filled|outline" options={options} value={value} onChange={setValue} />',
              },
              {
                label: 'SIZE + PLACEHOLDER',
                preview: (
                  <div className="preview-col full-row">
                    <Select size="sm" options={frameworkOptions} placeholder="Pick one" value={selectValue} onChange={setSelectValue} />
                    <Select size="md" options={frameworkOptions} placeholder="Pick one" value={selectValue} onChange={setSelectValue} />
                    <Select size="lg" options={frameworkOptions} placeholder="Pick one" value={selectValue} onChange={setSelectValue} />
                  </div>
                ),
                code: '<Select size="sm|md|lg" placeholder="Pick one" />',
              },
              {
                label: 'FORM STATE',
                preview: (
                  <Select
                    label="Framework"
                    options={frameworkOptions}
                    value={selectValue}
                    onChange={setSelectValue}
                    helperText="Solid is disabled"
                    error={selectValue === 'vue' ? 'Vue is temporarily unsupported' : undefined}
                    fullWidth
                  />
                ),
                code: '<Select label="Framework" helperText="..." error="..." fullWidth />',
              },
            ]}
          />
        </section>

        <section id="checkbox" className="docs-section">
          <DemoShowcase
            title="Checkbox"
            description="Shows default/filled variants, all sizes, indeterminate, helper/error, and disabled."
            variants={[
              {
                label: 'VARIANTS + SIZE',
                preview: (
                  <div className="inline-stack">
                    <Checkbox variant="default" size="sm" label="default sm" checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />
                    <Checkbox variant="default" size="md" label="default md" checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />
                    <Checkbox variant="filled" size="lg" label="filled lg" checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />
                  </div>
                ),
                code: '<Checkbox variant="default|filled" size="sm|md|lg" />',
              },
              {
                label: 'STATE',
                preview: (
                  <div className="preview-col full-row">
                    <Checkbox label="Enable notifications" checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} helperText="Boolean preference" />
                    <Checkbox label="Partially selected" checked={false} indeterminate helperText="indeterminate=true" />
                    <Checkbox label="Disabled" checked disabled />
                    <Checkbox label="Error example" checked={false} error="You must accept terms" />
                  </div>
                ),
                code: '<Checkbox indeterminate helperText="..." disabled error="..." />',
              },
            ]}
          />
        </section>

        <section id="toggle" className="docs-section">
          <DemoShowcase
            title="Toggle"
            description="All variants and sizes plus label/helper, disabled, and fullWidth behavior."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="inline-stack">
                    <Toggle variant="default" checked={toggleValue} onChange={setToggleValue} label="default" />
                    <Toggle variant="success" checked={toggleValue} onChange={setToggleValue} label="success" />
                    <Toggle variant="warning" checked={toggleValue} onChange={setToggleValue} label="warning" />
                    <Toggle variant="danger" checked={toggleValue} onChange={setToggleValue} label="danger" />
                  </div>
                ),
                code: '<Toggle variant="default|success|warning|danger" />',
              },
              {
                label: 'SIZE + STATE',
                preview: (
                  <div className="preview-col full-row">
                    <Toggle size="sm" checked={toggleValue} onChange={setToggleValue} label="sm" helperText="compact" />
                    <Toggle size="md" checked={toggleValue} onChange={setToggleValue} label="md" helperText="default" />
                    <Toggle size="lg" checked={toggleValue} onChange={setToggleValue} label="lg" helperText="large touch target" />
                    <Toggle checked onChange={() => undefined} disabled label="disabled" fullWidth helperText="fullWidth=true" />
                  </div>
                ),
                code: '<Toggle size="sm|md|lg" disabled fullWidth label="..." helperText="..." />',
              },
            ]}
          />
        </section>

        <section id="dropdown" className="docs-section">
          <DemoShowcase
            title="Dropdown"
            description="Covers variants, sizes, disabled, placeholder, custom trigger, and icons in options."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="preview-col full-row dropdown-relative">
                    <Dropdown variant="default" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} value={dropdownValue} onChange={setDropdownValue} />
                    <Dropdown variant="filled" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} value={dropdownValue} onChange={setDropdownValue} />
                    <Dropdown variant="outline" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} value={dropdownValue} onChange={setDropdownValue} />
                  </div>
                ),
                code: '<Dropdown variant="default|filled|outline" options={options} value={value} onChange={setValue} />',
              },
              {
                label: 'SIZE + TRIGGER',
                preview: (
                  <div className="preview-col full-row dropdown-relative">
                    <Dropdown size="sm" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} value={dropdownValue} onChange={setDropdownValue} />
                    <Dropdown size="md" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} value={dropdownValue} onChange={setDropdownValue} />
                    <Dropdown size="lg" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} value={dropdownValue} onChange={setDropdownValue} />
                    <Dropdown
                      trigger={<Button variant="outline">Custom Trigger</Button>}
                      options={[
                        { value: 'alpha', label: 'Alpha', icon: <span>A</span> },
                        { value: 'beta', label: 'Beta', icon: <span>B</span> },
                      ]}
                      placeholder="Custom"
                    />
                    <Dropdown disabled options={[{ value: 'x', label: 'Disabled demo' }]} placeholder="Disabled dropdown" />
                  </div>
                ),
                code: '<Dropdown size="sm|md|lg" trigger={<Button/>} disabled options={[{ icon: <span>A</span> }]} />',
              },
            ]}
          />
        </section>

        <section id="loading" className="docs-section">
          <DemoShowcase
            title="Loading"
            description="All loader variants, sizes, labels, and fullscreen mode."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="inline-stack">
                    <Loading variant="spinner" text="spinner" />
                    <Loading variant="dots" text="dots" />
                    <Loading variant="pulse" text="pulse" />
                    <Loading variant="image" text="image" />
                  </div>
                ),
                code: '<Loading variant="spinner|dots|pulse|image" />',
              },
              {
                label: 'SIZE + TEXT',
                preview: (
                  <div className="inline-stack">
                    <Loading size="sm" text="sm" />
                    <Loading size="md" text="md" />
                    <Loading size="lg" text="lg" />
                    <Loading size="xl" text="xl" />
                  </div>
                ),
                code: '<Loading size="sm|md|lg|xl" text="..." />',
              },
              {
                label: 'FULLSCREEN',
                preview: (
                  <>
                    <Button onClick={() => setShowFullscreenLoading(true)}>Show fullscreen loader</Button>
                    {showFullscreenLoading && (
                      <Loading
                        fullScreen
                        variant="spinner"
                        size="xl"
                        text="Loading fullscreen..."
                        className="cursor-pointer"
                      />
                    )}
                    {showFullscreenLoading && (
                      <Button variant="text" tone="danger" onClick={() => setShowFullscreenLoading(false)}>
                        Close fullscreen loader
                      </Button>
                    )}
                  </>
                ),
                code: '<Loading fullScreen variant="spinner" size="xl" text="Loading fullscreen..." />',
              },
            ]}
          />
        </section>

        <section id="skeleton" className="docs-section">
          <DemoShowcase
            title="Skeleton"
            description="Reusable skeleton placeholders for text, avatars, images, cards, and generic rectangular loading states."
            variants={[
              {
                label: 'COMMON PATTERNS',
                preview: (
                  <div className="preview-col full-row">
                    <div className="skeleton-row">
                      <Skeleton variant="avatar" className="h-12 w-12" />
                      <div className="skeleton-copy">
                        <Skeleton variant="text" lines={2} />
                      </div>
                    </div>
                    <Skeleton variant="image" className="h-44 rounded-xl" />
                    <Skeleton variant="rect" className="h-11 rounded-lg" />
                  </div>
                ),
                code: '<Skeleton variant="text|avatar|image|card|rect" />',
              },
              {
                label: 'TEXT + CARD',
                preview: (
                  <div className="preview-col full-row">
                    <Skeleton variant="text" lines={4} />
                    <Skeleton variant="card" lines={4} />
                  </div>
                ),
                code: '<Skeleton variant="text" lines={4} />\n<Skeleton variant="card" lines={4} />',
              },
              {
                label: 'LIGHT / DARK',
                preview: (
                  <div className="preview-col full-row">
                    <Typography variant="p" size="sm" color="neutral-300">
                      Skeleton uses design-system surface tokens, so it adapts automatically when the global theme switches between light and dark.
                    </Typography>
                    <Skeleton variant="card" animate={false} />
                  </div>
                ),
                code: '<Skeleton variant="card" animate={false} />',
              },
            ]}
          />
        </section>

        <section id="toast" className="docs-section">
          <DemoShowcase
            title="Toast"
            description="Demonstrates all types and positions, with duration and close button options."
            variants={[
              {
                label: 'TYPE',
                preview: (
                  <div className="inline-stack">
                    <Button onClick={() => { setToastType('success'); setToastVisible(true) }}>success</Button>
                    <Button variant="outline" onClick={() => { setToastType('info'); setToastVisible(true) }}>info</Button>
                    <Button variant="filled" tone="danger" onClick={() => { setToastType('error'); setToastVisible(true) }}>error</Button>
                    <Button variant="filled" tone="neutral" onClick={() => { setToastType('warning'); setToastVisible(true) }}>warning</Button>
                    <Toast
                      heading={toastType.toUpperCase()}
                      message="Toast message for current type"
                      type={toastType}
                      isVisible={toastVisible}
                      onClose={() => setToastVisible(false)}
                      duration={3000}
                      position={toastPosition}
                      showCloseButton
                    />
                  </div>
                ),
                code: '<Toast type="error|success|info|warning" duration={3000} showCloseButton isVisible={open} onClose={...} />',
              },
              {
                label: 'POSITION',
                preview: (
                  <div className="inline-stack">
                    <Button size="sm" onClick={() => { setToastPosition('top-left'); setToastVisible(true) }}>top-left</Button>
                    <Button size="sm" onClick={() => { setToastPosition('top-right'); setToastVisible(true) }}>top-right</Button>
                    <Button size="sm" onClick={() => { setToastPosition('bottom-left'); setToastVisible(true) }}>bottom-left</Button>
                    <Button size="sm" onClick={() => { setToastPosition('bottom-right'); setToastVisible(true) }}>bottom-right</Button>
                    <Button size="sm" onClick={() => { setToastPosition('top-center'); setToastVisible(true) }}>top-center</Button>
                    <Button size="sm" onClick={() => { setToastPosition('bottom-center'); setToastVisible(true) }}>bottom-center</Button>
                  </div>
                ),
                code: '<Toast position="top-left|top-right|bottom-left|bottom-right|top-center|bottom-center" />',
              },
            ]}
          />
        </section>

        <section id="alert" className="docs-section">
          <DemoShowcase
            title="Alert"
            description="All type and variant combinations, including close button and custom children content."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="preview-col full-row">
                    <Alert type="info" variant="default" title="Info default" message="Informational alert" />
                    <Alert type="success" variant="filled" title="Success filled" message="Saved successfully" />
                    <Alert type="warning" variant="outline" title="Warning outline" message="Please review values" />
                  </div>
                ),
                code: '<Alert type="info|success|warning|error" variant="default|filled|outline" title="..." message="..." />',
              },
              {
                label: 'TYPE + CLOSE',
                preview: (
                  <div className="preview-col full-row">
                    <Alert type="error" title="Error" message="Something failed" showCloseButton onClose={() => undefined} />
                    <Alert type="info" title="With custom child" showCloseButton onClose={() => undefined}>
                      <Typography variant="p" size="sm">Custom body content can be rendered using children.</Typography>
                    </Alert>
                  </div>
                ),
                code: '<Alert showCloseButton onClose={...}>{children}</Alert>',
              },
            ]}
          />
        </section>

        <section id="modal" className="docs-section">
          <DemoShowcase
            title="Modal"
            description="All sizes and behavior props: close button, overlay close, escape close, and custom title/content."
            variants={[
              {
                label: 'SIZES',
                preview: (
                  <div className="inline-stack">
                    <Button onClick={() => { setModalSize('sm'); setModalOpen(true) }}>sm</Button>
                    <Button onClick={() => { setModalSize('md'); setModalOpen(true) }}>md</Button>
                    <Button onClick={() => { setModalSize('lg'); setModalOpen(true) }}>lg</Button>
                    <Button onClick={() => { setModalSize('xl'); setModalOpen(true) }}>xl</Button>
                    <Button onClick={() => { setModalSize('full'); setModalOpen(true) }}>full</Button>
                    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Modal ${modalSize}`} size={modalSize}>
                      <Typography variant="p" color="neutral-400">This modal demonstrates the {modalSize} size.</Typography>
                    </Modal>
                  </div>
                ),
                code: '<Modal isOpen={open} onClose={close} size="sm|md|lg|xl|full" title="...">...</Modal>',
              },
              {
                label: 'BEHAVIOR',
                preview: (
                  <>
                    <Button variant="outline" onClick={() => setModalOpen(true)}>Open strict modal</Button>
                    <Modal
                      isOpen={modalOpen}
                      onClose={() => setModalOpen(false)}
                      title="Strict behavior"
                      showCloseButton={false}
                      closeOnEscape={false}
                      closeOnOverlayClick={false}
                    >
                      <Typography variant="p" color="neutral-300">This one does not close with overlay click or Escape.</Typography>
                      <Button onClick={() => setModalOpen(false)}>Close manually</Button>
                    </Modal>
                  </>
                ),
                code: '<Modal showCloseButton={false} closeOnEscape={false} closeOnOverlayClick={false} />',
              },
            ]}
          />
        </section>

        <section id="card" className="docs-section">
          <DemoShowcase
            title="Card"
            description="All card variants and padding sizes."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="inline-stack full-row">
                    <Card variant="default" padding="md" className="example-card"><Typography variant="p">default</Typography></Card>
                    <Card variant="elevated" padding="md" className="example-card"><Typography variant="p">elevated</Typography></Card>
                    <Card variant="outlined" padding="md" className="example-card"><Typography variant="p">outlined</Typography></Card>
                    <Card variant="filled" padding="md" className="example-card"><Typography variant="p">filled</Typography></Card>
                  </div>
                ),
                code: '<Card variant="default|elevated|outlined|filled" />',
              },
              {
                label: 'PADDING',
                preview: (
                  <div className="inline-stack full-row">
                    <Card padding="none" className="example-card"><Typography variant="p">padding none</Typography></Card>
                    <Card padding="sm" className="example-card"><Typography variant="p">padding sm</Typography></Card>
                    <Card padding="md" className="example-card"><Typography variant="p">padding md</Typography></Card>
                    <Card padding="lg" className="example-card"><Typography variant="p">padding lg</Typography></Card>
                  </div>
                ),
                code: '<Card padding="none|sm|md|lg" />',
              },
            ]}
          />
        </section>

        <section id="badge" className="docs-section">
          <DemoShowcase
            title="Badge"
            description="All variants, all sizes, and rounded options."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="inline-stack">
                    <Badge variant="default">default</Badge>
                    <Badge variant="primary">primary</Badge>
                    <Badge variant="success">success</Badge>
                    <Badge variant="warning">warning</Badge>
                    <Badge variant="danger">danger</Badge>
                    <Badge variant="info">info</Badge>
                  </div>
                ),
                code: '<Badge variant="default|primary|success|warning|danger|info">Label</Badge>',
              },
              {
                label: 'SIZE + ROUNDED',
                preview: (
                  <div className="inline-stack">
                    <Badge size="sm" rounded="sm">sm</Badge>
                    <Badge size="md" rounded="md">md</Badge>
                    <Badge size="lg" rounded="lg">lg</Badge>
                    <Badge size="md" rounded="full">full</Badge>
                  </div>
                ),
                code: '<Badge size="sm|md|lg" rounded="sm|md|lg|full" />',
              },
            ]}
          />
        </section>

        <section id="avatar" className="docs-section">
          <DemoShowcase
            title="Avatar"
            description="Image, fallback initials, all sizes, and click behavior."
            variants={[
              {
                label: 'SIZES',
                preview: (
                  <div className="inline-stack">
                    <Avatar size="sm" fallback="Ava Leonard" />
                    <Avatar size="md" fallback="Ava Leonard" />
                    <Avatar size="lg" fallback="Ava Leonard" />
                    <Avatar size="xl" fallback="Ava Leonard" />
                  </div>
                ),
                code: '<Avatar size="sm|md|lg|xl" fallback="Ava Leonard" />',
              },
              {
                label: 'IMAGE + CLICK',
                preview: (
                  <div className="inline-stack">
                    <Avatar src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" alt="Profile" />
                    <Avatar src="" fallback="No Source" />
                    <Avatar fallback="Click Me" onClick={() => setAvatarClicks((v) => v + 1)} />
                    <Typography variant="span" size="sm" color="neutral-300">clicked: {avatarClicks}</Typography>
                  </div>
                ),
                code: '<Avatar src="..." alt="Profile" />\n<Avatar fallback="Click Me" onClick={...} />',
              },
            ]}
          />
        </section>

        <section id="divider" className="docs-section">
          <DemoShowcase
            title="Divider"
            description="All orientations, variants, and sizes."
            variants={[
              {
                label: 'HORIZONTAL',
                preview: (
                  <div className="preview-col full-row">
                    <Divider orientation="horizontal" variant="solid" size="sm" />
                    <Divider orientation="horizontal" variant="dashed" size="md" />
                    <Divider orientation="horizontal" variant="dotted" size="lg" />
                  </div>
                ),
                code: '<Divider orientation="horizontal" variant="solid|dashed|dotted" size="sm|md|lg" />',
              },
              {
                label: 'VERTICAL',
                preview: (
                  <div className="inline-stack divider-group">
                    <div className="vertical-divider-wrap"><Divider orientation="vertical" variant="solid" size="sm" /></div>
                    <div className="vertical-divider-wrap"><Divider orientation="vertical" variant="dashed" size="md" /></div>
                    <div className="vertical-divider-wrap"><Divider orientation="vertical" variant="dotted" size="lg" /></div>
                  </div>
                ),
                code: '<Divider orientation="vertical" variant="solid|dashed|dotted" size="sm|md|lg" />',
              },
            ]}
          />
        </section>

        <section id="tooltip" className="docs-section">
          <DemoShowcase
            title="Tooltip"
            description="Position and delay props with custom trigger children."
            variants={[
              {
                label: 'POSITIONS',
                preview: (
                  <div className="inline-stack">
                    <Tooltip content="Top tooltip" position="top"><Button variant="outline">top</Button></Tooltip>
                    <Tooltip content="Bottom tooltip" position="bottom"><Button variant="outline">bottom</Button></Tooltip>
                    <Tooltip content="Left tooltip" position="left"><Button variant="outline">left</Button></Tooltip>
                    <Tooltip content="Right tooltip" position="right"><Button variant="outline">right</Button></Tooltip>
                  </div>
                ),
                code: '<Tooltip content="..." position="top|bottom|left|right">...</Tooltip>',
              },
              {
                label: 'DELAY',
                preview: (
                  <div className="inline-stack">
                    <Tooltip content="Immediate" delay={0}><Button>delay 0</Button></Tooltip>
                    <Tooltip content="Delayed" delay={1000}><Button variant="secondary">delay 1000ms</Button></Tooltip>
                  </div>
                ),
                code: '<Tooltip content="..." delay={0|1000}>...</Tooltip>',
              },
            ]}
          />
        </section>

        <section id="search-input" className="docs-section">
          <DemoShowcase
            title="SearchInput"
            description="All variants and sizes with clear button, keyboard shortcuts option, and active state control."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="preview-col full-row">
                    <SearchInput variant="default" placeholder="default" onSearch={setSearchValue} />
                    <SearchInput variant="filled" placeholder="filled" onSearch={setSearchValue} />
                    <SearchInput variant="outline" placeholder="outline" onSearch={setSearchValue} />
                  </div>
                ),
                code: '<SearchInput variant="default|filled|outline" onSearch={setValue} />',
              },
              {
                label: 'SIZE + FLAGS',
                preview: (
                  <div className="preview-col full-row">
                    <SearchInput size="sm" placeholder="small" onSearch={setSearchValue} />
                    <SearchInput size="md" placeholder="medium" showClearButton={false} onSearch={setSearchValue} />
                    <SearchInput size="lg" placeholder="large" onSearch={setSearchValue} enableKeyboardShortcuts isActive />
                    <Typography variant="span" size="sm" color="neutral-300">Value: {searchValue || '(empty)'}</Typography>
                  </div>
                ),
                code: '<SearchInput size="sm|md|lg" showClearButton={false} enableKeyboardShortcuts isActive />',
              },
            ]}
          />
        </section>

        <section id="file-upload" className="docs-section">
          <DemoShowcase
            title="FileUpload"
            description="All variants and sizes plus accept, multiple, maxSize, dragAndDrop, children override, and disabled."
            variants={[
              {
                label: 'VARIANTS + SIZE',
                preview: (
                  <div className="preview-col full-row">
                    <FileUpload variant="default" size="sm" accept=".png,.jpg" onFileSelect={(selected) => setFiles(selected.map((f) => f.name))} />
                    <FileUpload variant="filled" size="md" accept=".pdf" onFileSelect={(selected) => setFiles(selected.map((f) => f.name))} />
                    <FileUpload variant="outline" size="lg" accept=".txt,.md" onFileSelect={(selected) => setFiles(selected.map((f) => f.name))} />
                  </div>
                ),
                code: '<FileUpload variant="default|filled|outline" size="sm|md|lg" accept=".png,.jpg" />',
              },
              {
                label: 'DND + LIMITS',
                preview: (
                  <div className="preview-col full-row">
                    <FileUpload dragAndDrop multiple maxSize={1024 * 1024} onFileSelect={(selected) => setFiles(selected.map((f) => f.name))}>
                      <div className="upload-cta">Drop files here (max 1MB each)</div>
                    </FileUpload>
                    <FileUpload disabled>
                      <div className="upload-cta">Disabled upload area</div>
                    </FileUpload>
                    {files.length > 0 && <Typography variant="p" size="sm" color="neutral-300">{files.join(', ')}</Typography>}
                  </div>
                ),
                code: '<FileUpload dragAndDrop multiple maxSize={1024*1024} disabled>{children}</FileUpload>',
              },
            ]}
          />
        </section>

        <section id="progress" className="docs-section">
          <DemoShowcase
            title="Progress"
            description="All variants and sizes, max support, animated bar, and labels."
            variants={[
              {
                label: 'VARIANTS',
                preview: (
                  <div className="preview-col full-row">
                    <Progress value={progressValue} variant="default" showLabel />
                    <Progress value={progressValue} variant="success" showLabel />
                    <Progress value={progressValue} variant="warning" showLabel />
                    <Progress value={progressValue} variant="danger" showLabel />
                  </div>
                ),
                code: '<Progress value={64} variant="default|success|warning|danger" showLabel />',
              },
              {
                label: 'SIZE + MAX',
                preview: (
                  <div className="preview-col full-row">
                    <Progress value={25} max={50} size="sm" animated showLabel />
                    <Progress value={50} max={100} size="md" animated showLabel />
                    <Progress value={75} max={100} size="lg" animated showLabel />
                    <Button size="sm" onClick={() => setProgressValue((v) => (v >= 100 ? 0 : v + 10))}>Increase shared value</Button>
                  </div>
                ),
                code: '<Progress value={25} max={50} size="sm|md|lg" animated showLabel />',
              },
            ]}
          />
        </section>

        <section id="pagination" className="docs-section">
          <DemoShowcase
            title="Pagination"
            description="All pagination props: variant, size, first/last toggle, prev/next toggle, and maxVisiblePages."
            variants={[
              {
                label: 'VARIANT + SIZE',
                preview: (
                  <div className="preview-col full-row">
                    <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} variant="default" size="sm" />
                    <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} variant="outline" size="md" />
                    <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} variant="default" size="lg" />
                  </div>
                ),
                code: '<Pagination variant="default|outline" size="sm|md|lg" currentPage={page} totalPages={10} onPageChange={setPage} />',
              },
              {
                label: 'VISIBILITY',
                preview: (
                  <div className="preview-col full-row">
                    <Pagination currentPage={currentPage} totalPages={20} onPageChange={setCurrentPage} showFirstLast showPrevNext maxVisiblePages={5} />
                    <Pagination currentPage={currentPage} totalPages={20} onPageChange={setCurrentPage} showFirstLast={false} showPrevNext={false} maxVisiblePages={3} />
                    <Typography variant="span" size="sm" color="neutral-300">Current Page: {currentPage}</Typography>
                  </div>
                ),
                code: '<Pagination showFirstLast={false} showPrevNext={false} maxVisiblePages={3} />',
              },
            ]}
          />
        </section>

        <section id="radio" className="docs-section">
          <DemoShowcase
            title="Radio"
            description="All radio variants and sizes, plus helper/error/disabled in group usage."
            variants={[
              {
                label: 'VARIANTS + SIZE',
                preview: (
                  <div className="inline-stack">
                    <Radio name="plan-size" size="sm" variant="default" checked={plan === 'basic'} onChange={() => setPlan('basic')} label="sm default" />
                    <Radio name="plan-size" size="md" variant="default" checked={plan === 'pro'} onChange={() => setPlan('pro')} label="md default" />
                    <Radio name="plan-filled" size="lg" variant="filled" checked={plan === 'enterprise'} onChange={() => setPlan('enterprise')} label="lg filled" />
                  </div>
                ),
                code: '<Radio variant="default|filled" size="sm|md|lg" name="group" checked={...} onChange={...} />',
              },
              {
                label: 'STATE',
                preview: (
                  <div className="preview-col full-row">
                    <Radio name="plan-state" value="basic" checked={plan === 'basic'} onChange={() => setPlan('basic')} label="Basic" helperText="Standard tier" />
                    <Radio name="plan-state" value="pro" checked={plan === 'pro'} onChange={() => setPlan('pro')} label="Pro" error="Selection required" />
                    <Radio name="plan-state" value="enterprise" checked={plan === 'enterprise'} onChange={() => setPlan('enterprise')} label="Enterprise" disabled />
                  </div>
                ),
                code: '<Radio helperText="..." error="..." disabled />',
              },
            ]}
          />
        </section>

        <section id="accordion" className="docs-section">
          <DemoShowcase
            title="Accordion"
            description="Item content and default active item behavior."
            variants={[
              {
                label: 'DEFAULT',
                preview: (
                  <Accordion
                    items={[
                      { title: 'What is SSOVEE UI?', content: <Typography variant="p">A reusable React component library.</Typography> },
                      { title: 'How to use it?', content: <Typography variant="p">Import components directly from the package.</Typography> },
                    ]}
                  />
                ),
                code: '<Accordion items={[{ title, content }, { title, content }]} />',
              },
              {
                label: 'WITH ACTIVE',
                preview: (
                  <Accordion
                    active={1}
                    items={[
                      { title: 'First panel', content: <Typography variant="p">First content.</Typography> },
                      { title: 'Second panel active', content: <Typography variant="p">Starts expanded via active={1}.</Typography> },
                    ]}
                  />
                ),
                code: '<Accordion active={1} items={[...]} />',
              },
            ]}
          />
        </section>

        <section id="tabs" className="docs-section">
          <DemoShowcase
            title="Tabs"
            description="Default tab index, callback handling, and class customization props."
            variants={[
              {
                label: 'DEFAULT',
                preview: (
                  <Tabs
                    tabs={[
                      { label: 'Overview', content: <Typography variant="p">Overview panel.</Typography> },
                      { label: 'Details', content: <Typography variant="p">Details panel.</Typography> },
                    ]}
                    onTabChange={setSelectedTab}
                  />
                ),
                code: '<Tabs tabs={[...]} onTabChange={setSelectedTab} />',
              },
              {
                label: 'CUSTOM STYLE',
                preview: (
                  <Tabs
                    defaultActiveTab={1}
                    tabs={[
                      { label: 'One', content: <Typography variant="p">One content</Typography> },
                      { label: 'Two', content: <Typography variant="p">Two content</Typography> },
                      { label: 'Three', content: <Typography variant="p">Three content</Typography> },
                    ]}
                    containerClassName="flex w-full border border-border-1 rounded-[6px] mt-[16px] bg-surface-4"
                    buttonClassName="flex items-center gap-1 px-[8px] py-[4px] text-[13px] cursor-pointer transition-all duration-300 text-neutral-300 rounded-[6px] m-[8px]"
                    activeButtonClassName="bg-brand-color text-white"
                    onTabChange={setSelectedTab}
                  />
                ),
                code: '<Tabs defaultActiveTab={1} containerClassName="..." buttonClassName="..." activeButtonClassName="..." />',
              },
            ]}
          />
          <Typography variant="p" size="sm" color="neutral-300">Tab change callback value: {selectedTab}</Typography>
        </section>

        <section id="typography" className="docs-section">
          <DemoShowcase
            title="Typography"
            description="All important typography props: as/variant, sizes, weights, colors, and custom className."
            variants={[
              {
                label: 'VARIANT + AS',
                preview: (
                  <div className="preview-col full-row">
                    <Typography variant="h1" as="h2">Variant h1 rendered as h2</Typography>
                    <Typography variant="h3">Heading 3</Typography>
                    <Typography variant="p">Paragraph text</Typography>
                    <Typography variant="span">Inline span</Typography>
                  </div>
                ),
                code: '<Typography variant="h1|h2|h3|h4|h5|h6|p|span|div" as="h2">...</Typography>',
              },
              {
                label: 'SIZE + WEIGHT',
                preview: (
                  <div className="preview-col full-row">
                    <Typography size="xs" weight="thin">xs thin</Typography>
                    <Typography size="sm" weight="medium">sm medium</Typography>
                    <Typography size="md" weight="semibold">md semibold</Typography>
                    <Typography size="lg" weight="bold">lg bold</Typography>
                    <Typography size="2xl" weight="black">2xl black</Typography>
                  </div>
                ),
                code: '<Typography size="xs|sm|md|lg|xl|2xl|3xl|4xl|5xl" weight="thin|...|black" />',
              },
              {
                label: 'COLOR + CLASS',
                preview: (
                  <div className="preview-col full-row">
                    <Typography color="brand-color">brand-color</Typography>
                    <Typography color="red-500">red-500</Typography>
                    <Typography color="green-500">green-500</Typography>
                    <Typography color="blue-500">blue-500</Typography>
                    <Typography color="yellow-500" className="underline">yellow-500 with className underline</Typography>
                  </div>
                ),
                code: '<Typography color="neutral-100...neutral-900|brand-color|red-500|green-500|blue-500|yellow-500" className="..." />',
              },
            ]}
          />
        </section>

        <section id="image" className="docs-section">
          <DemoShowcase
            title="ImageWithPlaceholder"
            description="String and object src, fallback image, alt text, and className usage."
            variants={[
              {
                label: 'SOURCE TYPES',
                preview: (
                  <div className="inline-stack">
                    <ImageWithPlaceholder src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80" fallbackSrc="https://via.placeholder.com/320x180?text=Fallback" alt="Landscape" className="demo-image" />
                    <ImageWithPlaceholder src={{ src: 'https://images.unsplash.com/photo-1494790108755-2616b612b1f2?w=600&q=80' }} fallbackSrc="https://via.placeholder.com/320x180?text=Fallback+Object+Src" alt="Portrait" className="demo-image" />
                  </div>
                ),
                code: '<ImageWithPlaceholder src="..." />\n<ImageWithPlaceholder src={{ src: "..." }} />',
              },
              {
                label: 'FALLBACK',
                preview: (
                  <div className="inline-stack">
                    <ImageWithPlaceholder src="" fallbackSrc="https://via.placeholder.com/320x180?text=No+Source" alt="Fallback" className="demo-image" />
                  </div>
                ),
                code: '<ImageWithPlaceholder src="" fallbackSrc="https://via.placeholder.com/320x180?text=No+Source" alt="Fallback" />',
              },
            ]}
          />
        </section>

        <section id="table" className="docs-section">
          <DemoShowcase
            title="Table"
            description="Uses all table primitives including caption, header, body, footer, and interactive rows."
            variants={[
              {
                label: 'FULL TABLE',
                preview: (
                  <div className="full-row">
                    <Table>
                      <TableCaption>Project Status</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Owner</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow onClick={() => setSearchValue('Design System')}>
                          <TableCell>Design System</TableCell>
                          <TableCell>In Progress</TableCell>
                          <TableCell>Shivam</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Playground</TableCell>
                          <TableCell>Ready</TableCell>
                          <TableCell>Team</TableCell>
                        </TableRow>
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell>Total</TableCell>
                          <TableCell>2 items</TableCell>
                          <TableCell>Active</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                ),
                code: '<Table><TableCaption/><TableHeader/><TableBody/><TableFooter/></Table>\n<TableRow onClick={...}>...</TableRow>',
              },
            ]}
          />
        </section>
      </main>
    </div>
  )
}

export default App
