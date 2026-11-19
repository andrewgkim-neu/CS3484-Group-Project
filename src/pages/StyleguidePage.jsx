// /styleguide: live examples of every shared component.
// Check here before building your own version of a button, card, or input.

import { useState } from 'react'
import { getAlumni, getStudents } from '../api'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  EmptyState,
  ErrorMessage,
  FileInput,
  PageHeader,
  ProfileCard,
  Select,
  Spinner,
  StatusBadge,
  Tag,
  TagInput,
  TagList,
  TextArea,
  TextField,
} from '../components'
import { MAJORS, NETWORKING_STATUSES } from '../constants'
import { useApi } from '../hooks/useApi'
import { paths } from '../routes'

function Section({ title, children }) {
  return (
    <section className="stack">
      <h2 style={{ fontSize: 'var(--text-xl)' }}>{title}</h2>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  const { data, loading } = useApi(() => Promise.all([getAlumni(), getStudents()]), [])
  const [alumni = [], students = []] = data ?? []
  const [skills, setSkills] = useState(['Python', 'React'])
  const [fileName, setFileName] = useState('')

  return (
    <div className="stack-lg">
      <PageHeader
        title="Component styleguide"
        subtitle="Shared building blocks from src/components"
      />

      <Section title="Buttons">
        <div className="row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button variant="secondary" to={paths.search}>
            Router link
          </Button>
        </div>
      </Section>

      <Section title="Tags">
        <div className="row">
          <Tag>Default</Tag>
          <Tag variant="major">Computer Science</Tag>
          <Tag variant="skill">Python</Tag>
          <Tag variant="company">Google</Tag>
          {NETWORKING_STATUSES.map((s) => (
            <StatusBadge key={s.value} status={s.value} />
          ))}
          <Tag variant="skill" onRemove={() => {}}>
            Removable
          </Tag>
        </div>
        <TagList
          items={['Go', 'Java', 'Kubernetes', 'AWS', 'SQL', 'Rust']}
          variant="skill"
          max={4}
        />
      </Section>

      <Section title="Avatars">
        <div className="row">
          {alumni.slice(0, 3).map((a, i) => (
            <Avatar key={a.id} user={a} size={['sm', 'md', 'lg'][i]} />
          ))}
        </div>
      </Section>

      <Section title="Profile cards">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid">
            {alumni[0] && (
              <ProfileCard
                user={alumni[0]}
                actions={
                  <>
                    <Button size="sm" to={paths.chat(alumni[0].id)}>
                      Message
                    </Button>
                    <Button size="sm" variant="secondary" to={paths.schedule(alumni[0].id)}>
                      Schedule coffee
                    </Button>
                  </>
                }
              />
            )}
            {alumni[1] && (
              <ProfileCard user={alumni[1]} footer="Also majored in Business Administration" />
            )}
            {students[0] && <ProfileCard user={students[0]} />}
            {alumni[2] && <ProfileCard user={alumni[2]} compact />}
          </div>
        )}
      </Section>

      <Section title="Form inputs">
        <Card className="stack" style={{ maxWidth: 520 }}>
          <TextField
            label="Email"
            type="email"
            hint="Use your @northeastern.edu address"
            required
          />
          <TextField
            label="With an error"
            defaultValue="someone@gmail.com"
            error="Must be a Northeastern email"
          />
          <Select label="Major" options={MAJORS} placeholder="Choose a major" defaultValue="" />
          <TextArea label="Bio" rows={3} />
          <TagInput label="Skills" value={skills} onChange={setSkills} placeholder="e.g. SQL" />
          <FileInput
            label="Resume"
            accept=".pdf,.doc,.docx"
            fileName={fileName}
            onFileSelect={(f) => setFileName(f.name)}
          />
          <Checkbox label="Remember me" />
        </Card>
      </Section>

      <Section title="Feedback">
        <Spinner label="Loading example…" />
        <ErrorMessage error={new Error('Something went wrong')} onRetry={() => {}} />
        <EmptyState title="No messages yet" action={<Button to={paths.search}>Find alumni</Button>}>
          Start a conversation from someone&rsquo;s profile.
        </EmptyState>
      </Section>
    </div>
  )
}
