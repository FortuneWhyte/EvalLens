"""Seed a database with the datasets the front end already displays.

Run once after checkout so the API has something to serve:

    python seed.py

Idempotent: existing datasets are left alone.
"""
from __future__ import annotations

from sqlmodel import Session, select

from app.db import get_engine, init_db
from app.models import Dataset, DatasetItem

DATASETS = {
    "customer_support_v2": (
        "Support tickets with reference answers.",
        [
            ("001", "How do I reset my router?", "1. Unplug power. 2. Wait 30s. 3. Replug.", "hardware"),
            ("002", "Billing error on my invoice #992", "Transferring to billing agent immediately.", "billing,urgent"),
            ("003", "What are your business hours?", "We are open 9AM - 5PM EST, Mon-Fri.", "general"),
            ("004", "Can I cancel my subscription mid-month?", "Yes, refunds are prorated automatically.", "account"),
            ("005", "Do you ship to Canada?", "Yes, standard delivery is 5-7 business days.", "shipping"),
        ],
    ),
    "medical_qa_gold": (
        "Human-labelled clinical questions.",
        [
            ("001", "What is a normal resting heart rate for an adult?", "Between 60 and 100 beats per minute.", "vitals"),
            ("002", "Can ibuprofen be taken on an empty stomach?", "It is better taken with food to reduce stomach irritation.", "medication"),
            ("003", "How long is the incubation period for influenza?", "Typically one to four days.", "infectious"),
        ],
    ),
}


def main() -> None:
    init_db()
    with Session(get_engine()) as session:
        for name, (description, rows) in DATASETS.items():
            existing = session.exec(select(Dataset).where(Dataset.name == name)).first()
            if existing:
                print(f"{name}: already present, skipping")
                continue
            dataset = Dataset(name=name, description=description)
            session.add(dataset)
            session.commit()
            session.refresh(dataset)
            for external_id, question, reference, tags in rows:
                session.add(
                    DatasetItem(
                        dataset_id=dataset.id,
                        external_id=external_id,
                        question=question,
                        reference=reference,
                        tags=tags,
                    )
                )
            session.commit()
            print(f"{name}: seeded {len(rows)} items")


if __name__ == "__main__":
    main()
