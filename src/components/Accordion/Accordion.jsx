/* eslint-disable no-unused-vars */
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import AddIcon from "@mui/icons-material/Add";
import { AccordionData } from "../../assets/AccordionData";
import styles from "./Accordion.module.css";
import { styled } from "@mui/material/styles";

const CustomAccordion = styled(Accordion)(({ theme }) => ({
  padding: 0,
}));

const AccordionSection = () => {
  return (
    <AccordionGroup
      sx={{
        [`& .${accordionSummaryClasses.indicator}`]: {
          transition: "0.2s",
        },
        [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
          transform: "rotate(45deg)",
        },
      }}
    >
      {AccordionData.map((item, index) => (
        <CustomAccordion key={index} className={styles.accordionCard}>
          <AccordionSummary
            indicator={<AddIcon />}
            className={styles.accordionSummary}
          >
            {item.question}
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
            {/* {item.answer} */}
          </AccordionDetails>
        </CustomAccordion>
      ))}
    </AccordionGroup>
  );
};

export default AccordionSection;
