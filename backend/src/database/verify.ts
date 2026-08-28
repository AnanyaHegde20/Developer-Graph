import { connectDatabase, getSession, closeDatabase } from './connection';

const toNum = (val: any): number => (typeof val === 'number' ? val : val.toNumber());

const runVerification = async (): Promise<void> => {
  await connectDatabase();
  const session = getSession();

  try {
    // 1. Count all nodes by label
    const nodeResult = await session.run(`
      MATCH (n)
      RETURN labels(n) AS type, count(n) AS count
      ORDER BY type
    `);
    console.log('\n=== Node Counts ===');
    console.log('Label(s)                    Count');
    console.log('-'.repeat(40));
    for (const record of nodeResult.records) {
      const labels = record.get('type') as string[];
      const count = toNum(record.get('count'));
      console.log(`${labels.join(', ').padEnd(28)} ${count}`);
    }

    // 2. Count all relationships by type
    const relResult = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS relationship, count(r) AS count
      ORDER BY relationship
    `);
    console.log('\n=== Relationship Counts ===');
    console.log('Type                        Count');
    console.log('-'.repeat(40));
    for (const record of relResult.records) {
      const relType = record.get('relationship') as string;
      const count = toNum(record.get('count'));
      console.log(`${relType.padEnd(28)} ${count}`);
    }

    // 3. Verify graph connectivity (sample developer relationships)
    const connResult = await session.run(`
      MATCH (d:Developer)-[r]->(x)
      RETURN d.name AS developer, type(r) AS relationship, labels(x) AS targetLabels,
             coalesce(x.name, x.title) AS target
      LIMIT 30
    `);
    console.log('\n=== Graph Connectivity (Sample) ===');
    console.log('Developer                   Relationship            Target                  Labels');
    console.log('-'.repeat(85));
    for (const record of connResult.records) {
      const dev = record.get('developer') as string;
      const rel = record.get('relationship') as string;
      const targetLabels = record.get('targetLabels') as string[];
      const target = (record.get('target') as string) ?? '(null)';
      console.log(`${dev.padEnd(28)} ${rel.padEnd(22)} ${target.padEnd(22)} [${targetLabels.join(', ')}]`);
    }

    // 4. Multi-hop traversal verification
    const hopResult = await session.run(`
      MATCH (d:Developer)-[:HAS_SKILL]->(s:Skill)
            <-[:REQUIRES]-(p:Project)
            -[:USES]->(t:Technology)
      RETURN
          d.name AS developer,
          s.name AS skill,
          p.name AS project,
          t.name AS technology
      LIMIT 30
    `);
    console.log('\n=== Multi-Hop Traversal: Developer -> Skill <- Project -> Technology ===');
    console.log('Developer                   Skill                    Project                 Technology');
    console.log('-'.repeat(95));
    for (const record of hopResult.records) {
      const dev = record.get('developer') as string;
      const skill = record.get('skill') as string;
      const project = record.get('project') as string;
      const tech = record.get('technology') as string;
      console.log(`${dev.padEnd(28)} ${skill.padEnd(23)} ${project.padEnd(23)} ${tech}`);
    }

    console.log('\n=== Verification Complete ===\n');
  } catch (error) {
    console.error('Verification failed:', error);
    throw error;
  } finally {
    await session.close();
  }
};

if (require.main === module) {
  connectDatabase()
    .then(() => runVerification())
    .then(() => closeDatabase())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
